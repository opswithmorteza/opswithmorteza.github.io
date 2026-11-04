# Morteza Rajabi — Personal Space

A bilingual portfolio with three experiences: Linux desktop, Windows desktop and a classic editorial portfolio. Built from scratch with HTML, CSS and JavaScript. No login, build step or backend.

## Content

- English and Persian with RTL support
- Keyboard shortcuts 1 / 2 / 3 on the environment chooser
- Interactive desktop apps with draggable, maximizable windows
- A simulated portfolio terminal: `help`, `whoami`, `projects`, `skills`, `contact`, `date`, `clear`, `exit`
- Public projects are distinguished from curated third-party software
- Reduced-motion and mobile layouts

The terminal is a browser simulation. It does not execute system commands.

## Editing

Content and styles are in `index.html`. Update the `projects`, `apps`, `links`, `aboutHTML` and `focusHTML` definitions. Text with `data-en` and `data-fa` has both language variants.

## Publishing

GitHub Settings → Pages → Deploy from a branch → main → /(root).

Custom domain: mortezarajabi.ir. Configure the custom domain in GitHub before changing DNS. Root A records: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153. `www` CNAME: opswithmorteza.github.io.

IRNIC stores authoritative nameservers. A DNS hosting service is required to create A/CNAME records. Use the nameservers assigned by that provider; GitHub's IP addresses are not nameservers.

## Attribution

Visual references supplied by the owner: Suraj Yadav portfolio-v4 and Tetra Dragon. This implementation uses original code and layout, not copied source or personal content. External projects retain their own licenses. Fonts are loaded from Google Fonts with system fallbacks.

## Automatic project index

The site reads the public GitHub repositories API on page load, excludes forks, archived/disabled repositories and the profile README repository, and displays original public repositories automatically. No token is included. On API errors or rate limits, a curated static fallback remains available. Update the `projects` array for bilingual descriptions of featured work. New repositories can use their GitHub descriptions.

Professional content comes from the owner’s supplied resume and statements. The 5+ years figure is owner-provided. Residential address, birth date and other unrelated personal details are not published. Portfolio labs are described as demos, not historical client deployments.


## Showcase and interactive editions

The editorial project cards use original code and locally captured demo images. Images switch from grayscale to color on hover/focus, with touch and reduced-motion fallbacks. Project filters cover mobile, web/ERP, infrastructure and security.

- `money-demo.html`: original responsive web companion; native MIT Money UT fork and actual QML input-validation improvement are credited to Suraj Yadav upstream.
- `desk-demo.html`: browser-only incident workflow preview; API and SQLite implementation live in fullstack-service-desk.
- `erp-demo.html`: original readiness-review companion, not a running ERPNext installation. The ERPNext fork preserves Frappe/contributor GPL-3.0 attribution and adds an offline configuration reviewer, tests and an operations guide.
- `services.js`: bilingual professional console responses explain skills, collaboration scope and deliverables.
- `games-core.js` / `games-extra.js`: original Tic-Tac-Toe (minimax computer) and Snake. `node test-games.cjs` verifies rules and all 569 complete human-move paths against the computer. Existing Pipeline Pairs remains available.

The original photo was supplied by the owner; the approved portrait artwork was AI-assisted. New code follows this repository's MIT license. External ERP and mobile application source retain their own licenses and author credits. No customer deployments, independent security certification or third-party authorship is implied.


## Compact editorial sections

The classic view adds verified GitHub activity, a resume-based journey, a filterable horizontal project carousel, original technical notes, per-project details, light/dark theme, Ctrl+K navigation and email copying. All use browser-native APIs and original CSS/JavaScript. The three demo preview images total about 40 KB; images are reused and loaded lazily.

`github-activity.json` is a dated snapshot from the official public GitHub contribution calendar. The interface labels it as a snapshot and never invents activity, awards or career dates. To refresh the calendar, run `python update_activity.py` and publish the changed JSON. Public repository totals also refresh in the browser from GitHub when available. The generator rejects incomplete/unknown calendar markup rather than filling it with fabricated numbers. No token is embedded.

The source inspiration is the owner-supplied Suraj Yadav portfolio-v4 reference; no source, project screenshots, biography, awards or article text was copied from that site. Technical notes describe this account's actual public code and its documented limits.
