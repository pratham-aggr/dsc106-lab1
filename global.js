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



// Use absolute paths for navigation so links work from any page


// Helper to get correct relative path for each page
function getRelativeUrl(target) {
  // If external, return as is
  if (target.startsWith('http')) return target;
  // Get current path segments
  let current = location.pathname.split('/').filter(Boolean);
  // Remove filename if present
  if (current.length && current[current.length - 1].includes('.')) current.pop();
  // Target segments
  let targetParts = target.split('/');
  // Remove ./ if present
  if (targetParts[0] === '.') targetParts.shift();
  // If already in same folder
  if (current.length === 0) return target;
  // Go up for each folder deep
  let prefix = '';
  for (let i = 0; i < current.length; i++) prefix += '../';
  return prefix + target;
}

const pages = [
  { url: 'index.html', title: 'Home' },
  { url: 'projects/index.html', title: 'Projects' },
  { url: 'contact/index.html', title: 'Contact' },
  { url: 'https://github.com/pratham-aggr', title: 'Profile', external: true },
  { url: 'resume.html', title: 'Resume' }
];

const nav = document.createElement('nav');
document.body.prepend(nav);




for (const p of pages) {
  const a = document.createElement('a');
  a.href = getRelativeUrl(p.url);
  a.textContent = p.title;
  // Highlight current page: match by pathname ending
  if (!p.external && location.pathname.endsWith(p.url)) {
    a.classList.add('current');
  }
  // Open external links in new tab
  if (p.external) {
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  }
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