"""Refresh public GitHub activity. No token, private data or synthetic counts."""
import datetime as dt
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import urllib.request

USER = 'opswithmorteza'

class Calendar(HTMLParser):
    def __init__(self):
        super().__init__()
        self.cells = {}
        self.labels = {}
        self.tooltip = None
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'td' and 'data-date' in attrs and 'data-level' in attrs:
            self.cells[attrs['id']] = {'date': attrs['data-date'], 'level': int(attrs['data-level'])}
        if tag == 'tool-tip':
            self.tooltip = attrs.get('for')
    def handle_data(self, text):
        if self.tooltip:
            self.labels[self.tooltip] = self.labels.get(self.tooltip, '') + text
    def handle_endtag(self, tag):
        if tag == 'tool-tip':
            self.tooltip = None
    def days(self):
        results = []
        for key, cell in self.cells.items():
            label = self.labels.get(key, '').strip()
            match = re.match(r'([\d,]+) contributions?\b', label)
            if label.startswith('No contributions'):
                count = 0
            elif match:
                count = int(match[1].replace(',', ''))
            else:
                raise ValueError('Unknown contribution label; retain previous snapshot')
            results.append({**cell, 'count': count})
        if len(results) < 300:
            raise ValueError('Incomplete calendar; retain previous snapshot')
        return sorted(results, key=lambda day: day['date'])

def fetch(url):
    request = urllib.request.Request(url, headers={'User-Agent': 'MortezaPortfolio-PublicActivity'})
    with urllib.request.urlopen(request, timeout=20) as response:
        return response.read().decode()

def main():
    today = dt.datetime.now(dt.timezone.utc).date()
    profile = json.loads(fetch(f'https://api.github.com/users/{USER}'))
    first_year = int(profile['created_at'][:4])
    years = {}
    for year in range(first_year, today.year + 1):
        parser = Calendar()
        parser.feed(fetch(f'https://github.com/users/{USER}/contributions?from={year}-01-01&to={year}-12-31'))
        years[str(year)] = [day for day in parser.days() if day['date'] <= today.isoformat()]
    repositories = []
    for page in range(1, 4):
        batch = json.loads(fetch(f'https://api.github.com/users/{USER}/repos?per_page=100&page={page}'))
        repositories.extend(batch)
        if len(batch) < 100:
            break
    data = {'user': USER, 'updatedAt': dt.datetime.now(dt.timezone.utc).isoformat(),
            'source': f'https://github.com/{USER}', 'years': years,
            'stats': {'publicRepos': profile['public_repos'],
                      'originalRepos': sum(not r['fork'] for r in repositories),
                      'forks': sum(r['fork'] for r in repositories),
                      'stars': sum(r['stargazers_count'] for r in repositories if not r['fork'])}}
    Path(__file__).with_name('github-activity.json').write_text(json.dumps(data, separators=(',', ':')), encoding='utf-8')
    print('Saved verified public activity:', data['stats'], 'years:', list(years))

if __name__ == '__main__':
    main()
