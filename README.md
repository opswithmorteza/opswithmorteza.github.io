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
