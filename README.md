# Dr. Gent Ymeri — personal website

A responsive academic website for **https://gentymeri.github.io/**. Plain HTML, CSS, and JavaScript; no package installation, framework, or paid service required.

## Preview locally

From this folder:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000. Stop the server with Ctrl+C. Use the local server for citation controls; browsers may restrict bibliography loading when opening HTML directly from disk.

## Publish to GitHub Pages

The existing repository is **https://github.com/gentymeri/gentymeri.github.io**. Clone it first to preserve its history.

1. Open [the repository's Pages settings](https://github.com/gentymeri/gentymeri.github.io/settings/pages). Under **Build and deployment → Source**, select **GitHub Actions**. The workflow is already included; no template needs to be added.
2. In Terminal, run the following from this project's folder. Run the clone step only once:

```sh
cd /Users/al6268/Desktop/personal_website
git clone https://github.com/gentymeri/gentymeri.github.io.git github-pages
cp -R index.html 404.html styles.css script.js assets scripts .github .nojekyll .gitignore robots.txt sitemap.xml README.md github-pages/
cd github-pages
git add index.html 404.html styles.css script.js assets scripts .github .nojekyll .gitignore robots.txt sitemap.xml README.md
git diff --cached --stat
git commit -m "Publish personal research website"
git push
```

3. Open **Actions → Deploy website to GitHub Pages** and wait for the successful deployment. If the push ran before Pages was enabled, choose **Run workflow**, selecting the repository's default branch.
4. Visit **https://gentymeri.github.io/**.

The workflow deploys pushes to the repository's existing default branch, including `main` or `master`. It packages only public site files into `dist/`.

For later updates, edit files inside `github-pages/`, then commit and push from that folder. If editing the original project folder instead, repeat the copy command above before committing in `github-pages/`.

Alternatively, omit the custom workflow and select **Deploy from a branch → your default branch → / (root)** in Pages settings. The root files are already publishable. `.nojekyll` disables Jekyll processing. Use one deployment method.

Official setup documentation: [Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

## Edit the content

- **Biography, research, publications, PhD, projects, media, contact:** edit the labelled sections of `index.html`.
- **Colours, spacing, responsive layout:** edit `styles.css`. The palette is defined at the top.
- **CV:** replace `assets/gent-ymeri-cv.pdf` with your latest PDF, keeping the filename. The homepage and contact links use it, and the build includes it automatically. To publish this update from `github-pages/`, run `git add index.html README.md assets/gent-ymeri-cv.pdf`, then `git commit -m "Add downloadable CV"` and `git push`.
- **Portrait:** replace `assets/gent-ymeri.jpg`; keep its filename or update the HTML, social metadata, and structured data.
- **Publication citations:** update `assets/publications.bib`. Each publication's `data-key` and citation button's `data-cite` must match its BibTeX key. Add a publication by copying an existing `<article class="publication">`; set `data-type` to `journal` or `conference`.
- **Email:** update the visible address and `mailto:` link in `index.html`, the copy address in `script.js`, and the structured data in the HTML head.
- **Site address:** if changing the repository or domain, update the canonical, Open Graph, structured data, `sitemap.xml`, `robots.txt`, and the absolute homepage link in `404.html`.

The site uses system fonts and a locally stored portrait. It has no third-party scripts, analytics, trackers, backend, or contact-form service. Core content and links work without JavaScript. JavaScript adds publication filtering, search, BibTeX dialogs, email copying, navigation highlighting, and a mobile menu.

`python3 scripts/build.py` copies only public site files to `dist/`. The GitHub Actions workflow uses that directory, so the README and scripts are not included in the deployed artifact.

## Content sources

Public records were checked on 11 November 2026. The owner confirmed the display name **Dr. Gent Ymeri**, the general title **Researcher**, a completed PhD, and interest in postdoctoral or other research positions. No specific current employment title is displayed.

- [Malmö University profile](https://mau.se/en/persons/gent.ymeri/) — research interests, contact, university portrait. The portrait remains subject to its original rights; no general image licence is asserted here.
- [DiVA publication record](https://mau.diva-portal.org/smash/person.jsf?pid=authority-person%3A101179) — publication metadata, thesis title, defence date, supervisors, licentiate thesis.
- [Doctoral thesis DOI](https://doi.org/10.24834/isbn.9789178777846) and [full text](https://www.diva-portal.org/smash/get/diva2:2057427/FULLTEXT01.pdf).
- [Frontiers paper](https://doi.org/10.3389/fdgth.2026.1876052), [DIS paper](https://doi.org/10.1145/3800645.3813029), [ACM Healthcare paper](https://doi.org/10.1145/3779306), and the DOI links in the bibliography.
- [ParkApp protocol](https://doi.org/10.1136/bmjopen-2023-077766) and [IVA's 100 List](https://www.iva.se/en/what-iva-does/distinctions/ivas-100-lista-eng/parkapp/).
- [Mobistudy](https://mobistudy.org/) and [Edinburgh's publication record](https://www.research.ed.ac.uk/en/publications/mobistudy-mobile-based-platform-independent-multi-dimensional-dat/).
- [Malmö University feature](https://mau.se/en/news/home-monitoring-of-Parkinsons-disease-symptoms-could-improve-care/) and [SVT coverage](https://www.svt.se/nyheter/lokalt/skane/forskning-ai-kan-hora-om-du-har-parkinsons-sjukdom).

The lived-experiences article is listed as 2026, matching the current university profile and publisher publication year; some DiVA entries show the earlier 2025 record date. This site is a selected bibliography, not a claim to list every publication.
