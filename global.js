console.log('IT\'S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}
// Step 2.1: Get an array of all nav links
// const navLinks = $$("nav a");

// Step 2.2: Find the link to the current page
// const currentLink = navLinks.find(
//   (a) => a.host === location.host && a.pathname === location.pathname
// );

// Step 2.3: Add the current class to the current page link

// Step 3.1: Add navigation menu dynamically

// Step 3.1: Add navigation menu dynamically (improved)
const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")

// Helper to get correct relative path for each page
function getRelativeUrl(url) {
  if (url.startsWith('http')) return url;
  // Remove leading './' or '/' if present
  url = url.replace(/^\.?\/?/, '');
  // If on root (index.html in root), no prefix needed
  let path = location.pathname;
  if (path === '/' || path === '/index.html') return url;
  // Otherwise, go up for each directory deep (excluding filename)
  let segments = path.split('/').filter(Boolean);
  // Remove the last segment if it's a file (has a dot)
  if (segments.length && segments[segments.length - 1].includes('.')) segments.pop();
  let prefix = '';
  for (let i = 0; i < segments.length; i++) prefix += '../';
  return prefix + url;
}

let pages = [
  { url: 'index.html', title: 'Home' },
  { url: 'projects/index.html', title: 'Projects' },
  { url: 'contact/index.html', title: 'Contact' },
  { url: 'https://github.com/pratham-aggr', title: 'Profile', external: true },
  { url: 'resume.html', title: 'Resume' }
];

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
  let url = getRelativeUrl(p.url);
  let a = document.createElement('a');
  a.href = url;
  a.textContent = p.title;
  // Highlight current page
  a.classList.toggle(
    'current',
    a.host === location.host && a.pathname === location.pathname
  );
  // Open external links in new tab
  a.toggleAttribute('target', a.host !== location.host);
  nav.append(a);
}

// Step 4.2: Add color scheme switcher
document.body.insertAdjacentHTML(
  'afterbegin',
  `\n<label class="color-scheme">\n  Theme:\n  <select>\n    <option value="light dark">Automatic</option>\n    <option value="light">Light</option>\n    <option value="dark">Dark</option>\n  </select>\n</label>`
);

// Step 4.4 & 4.5: Make the switcher work and persist preference
const select = document.querySelector('.color-scheme select');

function setColorScheme(scheme) {
  document.documentElement.style.setProperty('color-scheme', scheme);
  select.value = scheme;
}

// On page load, check for saved preference
if ('colorScheme' in localStorage) {
  setColorScheme(localStorage.colorScheme);
}

select.addEventListener('input', function (event) {
  setColorScheme(event.target.value);
  localStorage.colorScheme = event.target.value;
});