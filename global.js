console.log('IT\'S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// Helper to get correct relative path for each page based on current location
function getRelativeUrl(target) {
  if (target.startsWith('http')) return target;
  // Get current path (directory only)
  let currentPath = location.pathname;
  if (!currentPath.endsWith('/')) {
    currentPath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
  }
  // If already in same folder
  if (currentPath === '/' && !target.includes('/')) return target;
  // Count how many folders deep we are
  let depth = currentPath.split('/').filter(Boolean).length;
  // If at root, just use target
  if (depth === 0) return target;
  // If target is in a subfolder (e.g., contact/index.html)
  if (target.includes('/')) {
    // If already in that subfolder, just use filename
    let folder = target.split('/')[0];
    if (currentPath.includes(folder + '/')) {
      return target.split('/')[1];
    }
  }
  // Otherwise, go up for each folder deep
  let prefix = '';
  for (let i = 1; i < depth; i++) prefix += '../';
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
  // Highlight current page: match by normalized path
  let normalizedCurrent = location.pathname.replace(/\/index\.html$/, '/').replace(/\/$/, '/index.html');
  let normalizedTarget = '/' + p.url;
  if (!p.external && (normalizedCurrent === normalizedTarget || location.pathname.endsWith(p.url))) {
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

export async function fetchJSON(url) {
  try {
    const response = await fetch(url);

    // Check if request was successful
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    // Parse JSON data
    const data = await response.json();

    return data;

  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  containerElement.innerHTML = '';

  for (const project of projects) {
    const article = document.createElement('article');

    article.innerHTML = `
      <${headingLevel}>${project.title}</${headingLevel}>
      <img src="${project.image}" alt="${project.title}">
      <div>
        <p>${project.description}</p>
        <p class="project-year"><em>c. ${project.year}</em></p>
      </div>
    `;

    containerElement.appendChild(article);
  }
}

export async function fetchGithubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}