const root = document.documentElement;
const themeButton = document.querySelector('#theme-toggle');
const systemTheme = matchMedia('(prefers-color-scheme: dark)');

let themePreference;
try {
  themePreference = localStorage.getItem('accp-concept-theme');
} catch {
  themePreference = null;
}

function applyTheme(value) {
  const dark = value === 'dark';
  root.dataset.theme = dark ? 'dark' : 'light';
  themeButton.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  themeButton.querySelector('use').setAttribute('href', dark ? '#i-sun' : '#i-moon');
}

applyTheme(themePreference ?? (systemTheme.matches ? 'dark' : 'light'));
systemTheme.addEventListener('change', (event) => {
  if (!themePreference) applyTheme(event.matches ? 'dark' : 'light');
});
themeButton.addEventListener('click', () => {
  themePreference = root.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(themePreference);
  try {
    localStorage.setItem('accp-concept-theme', themePreference);
  } catch {
    // The current page remains usable with browser storage disabled.
  }
});

const menu = document.querySelector('.mobile-menu');
const navigation = document.querySelector('#navigation');
function setMenu(open) {
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  navigation.classList.toggle('open', open);
}
menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenu(false);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) {
    setMenu(false);
    menu.focus();
  }
});

const colorNote = document.querySelector('.copy-note');
for (const swatch of document.querySelectorAll('[data-copy]')) {
  swatch.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(swatch.dataset.copy);
      colorNote.textContent = 'Copied ' + swatch.dataset.copy + '.';
    } catch {
      colorNote.textContent = 'Hex code: ' + swatch.dataset.copy;
    }
  });
}

document.querySelector('#quote-form').addEventListener('submit', (event) => {
  event.preventDefault();
  document.querySelector('.form-status').textContent = 'The request is ready for review. No information was sent.';
});
