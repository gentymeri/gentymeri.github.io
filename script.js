'use strict';

// Content and links stay available when JavaScript is disabled.
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-nav');
const mobileViewport = window.matchMedia('(max-width: 700px)');
function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.querySelector('span').textContent = '＋';
  navigation.hidden = mobileViewport.matches;
}
function updateNavigation() {
  menuToggle.hidden = !mobileViewport.matches;
  closeMenu();
}
updateNavigation();
mobileViewport.addEventListener('change', updateNavigation);
menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  menuToggle.querySelector('span').textContent = expanded ? '＋' : '−';
  navigation.hidden = expanded;
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a') && mobileViewport.matches) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && mobileViewport.matches && !navigation.hidden) {
    closeMenu();
    menuToggle.focus();
  }
});
document.addEventListener('click', event => {
  if (mobileViewport.matches && !event.target.closest('.site-header')) closeMenu();
});

const publications = [...document.querySelectorAll('.publication')];
const filterButtons = [...document.querySelectorAll('[data-filter]')];
const searchInput = document.querySelector('#publication-search');
let selectedFilter = 'all';
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
function filterPublications() {
  const query = normalize(searchInput.value.trim());
  let visibleCount = 0;
  for (const publication of publications) {
    const matches = (selectedFilter === 'all' || publication.dataset.type === selectedFilter)
      && normalize(publication.textContent).includes(query);
    publication.hidden = !matches;
    if (matches) visibleCount++;
  }
  document.querySelector('.empty-state').hidden = visibleCount > 0;
  document.querySelector('#publication-count').textContent = `${visibleCount} of ${publications.length} publications shown.`;
}
document.querySelector('.publication-tools').hidden = false;
filterButtons.forEach(button => button.addEventListener('click', () => {
  selectedFilter = button.dataset.filter;
  filterButtons.forEach(filter => {
    filter.classList.toggle('active', filter === button);
    filter.setAttribute('aria-pressed', String(filter === button));
  });
  filterPublications();
}));
searchInput.addEventListener('input', filterPublications);
filterPublications();

const toast = document.querySelector('.toast');
let toastTimer;
function notify(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 3500);
}
async function copyText(value) {
  if (navigator.clipboard && window.isSecureContext) {
    try { await navigator.clipboard.writeText(value); return true; } catch { /* Try the selection fallback. */ }
  }
  const field = document.createElement('textarea');
  field.value = value;
  field.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
  // Append inside an open dialog so its focus trap does not block selection.
  (document.querySelector('dialog[open]') || document.body).append(field);
  field.select();
  let copied = false;
  try { copied = document.execCommand('copy'); } catch { /* Manual copy remains available. */ }
  field.remove();
  return copied;
}
const copyEmail = document.querySelector('.copy-email');
copyEmail.hidden = false;
copyEmail.addEventListener('click', async () => {
  const copied = await copyText('gent.ymeri@mau.se');
  notify(copied ? 'Email address copied.' : 'Please select and copy gent.ymeri@mau.se.');
  copyEmail.focus();
});

const citationDialog = document.querySelector('#citation-dialog');
const citationText = document.querySelector('#citation-text');
const citationDownload = document.querySelector('#download-citation');
let citationUrl;
let citationTrigger;
// Fetch a single, editable bibliography. Citation controls appear only once it loads.
fetch('assets/publications.bib').then(response => {
  if (!response.ok) throw new Error('Bibliography unavailable');
  return response.text();
}).then(bibliography => {
  const entries = new Map();
  for (const entry of bibliography.match(/@\w+\{[^]*?\n\}/g) || []) {
    entries.set(entry.match(/^@\w+\{([^,]+),/)[1], entry);
  }
  if (typeof citationDialog.showModal !== 'function') return;
  document.querySelectorAll('[data-cite]').forEach(button => {
    const entry = entries.get(button.dataset.cite);
    if (!entry) return;
    button.hidden = false;
    button.addEventListener('click', () => {
      citationTrigger = button;
      citationText.textContent = entry;
      document.querySelector('.copy-status').textContent = '';
      if (citationUrl) URL.revokeObjectURL(citationUrl);
      citationUrl = URL.createObjectURL(new Blob([entry + '\n'], { type: 'application/x-bibtex;charset=utf-8' }));
      citationDownload.href = citationUrl;
      citationDownload.download = `${button.dataset.cite}.bib`;
      citationDialog.showModal();
    });
  });
}).catch(() => { /* The full bibliography download and DOI links remain usable. */ });
document.querySelector('.dialog-close').addEventListener('click', () => citationDialog.close());
citationDialog.addEventListener('click', event => {
  if (event.target === citationDialog) {
    const bounds = citationDialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) citationDialog.close();
  }
});
citationDialog.addEventListener('close', () => {
  if (citationUrl) { URL.revokeObjectURL(citationUrl); citationUrl = undefined; }
  citationTrigger?.focus();
});
document.querySelector('#copy-citation').addEventListener('click', async event => {
  const copied = await copyText(citationText.textContent);
  document.querySelector('.copy-status').textContent = copied ? 'BibTeX copied to clipboard.' : 'Select the reference above to copy it, or download the .bib file.';
  event.target.focus();
});

if ('IntersectionObserver' in window) {
  const navLinks = [...navigation.querySelectorAll('a')];
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    if (!visible.length) return;
    navLinks.forEach(link => {
      if (link.hash === `#${visible[0].target.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
  document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
}
document.querySelector('#current-year').textContent = new Date().getFullYear();
