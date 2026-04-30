import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');

const projectsTitle = document.querySelector('.projects-title');
if (projectsTitle) {
  projectsTitle.textContent = `Here are some of my Projects I am proud sharing (${projects.length} projects)`;
}

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let colors = d3.scaleOrdinal(d3.schemeTableau10);

let query = '';
let selectedIndex = -1;

// Returns projects matching the current search query
function getSearchFiltered() {
  return projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });
}

function renderPieChart(projectsData) {
  const svg = d3.select('svg#projects-pie-plot');
  svg.selectAll('path').remove();
  d3.select('.legend').selectAll('li').remove();

  let rolledData = d3.rollups(projectsData, (v) => v.length, (d) => d.year);
  let data = rolledData.map(([year, count]) => ({ value: count, label: year }));

  let sliceGenerator = d3.pie().value((d) => d.value);
  let arcData = sliceGenerator(data);
  let arcs = arcData.map((d) => arcGenerator(d));

  arcs.forEach((arc, i) => {
    svg
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(i))
      .attr('class', i === selectedIndex ? 'selected' : '')
      .on('click', () => {
        selectedIndex = selectedIndex === i ? -1 : i;

        // Re-apply selected class to all paths and legend items
        svg
          .selectAll('path')
          .attr('class', (_, idx) => (idx === selectedIndex ? 'selected' : ''));
        d3.select('.legend')
          .selectAll('li')
          .attr('class', (_, idx) =>
            idx === selectedIndex ? 'legend-item selected' : 'legend-item'
          );

        // Filter and render projects using BOTH active filters
        let searchFiltered = getSearchFiltered();
        if (selectedIndex === -1) {
          renderProjects(searchFiltered, projectsContainer, 'h2');
        } else {
          let selectedYear = data[selectedIndex].label;
          renderProjects(
            searchFiltered.filter((p) => p.year === selectedYear),
            projectsContainer,
            'h2'
          );
        }
      });
  });

  let legend = d3.select('.legend');
  data.forEach((d, i) => {
    legend
      .append('li')
      .attr('style', `--color:${colors(i)}`)
      .attr('class', i === selectedIndex ? 'legend-item selected' : 'legend-item')
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
      .on('click', () => {
        selectedIndex = selectedIndex === i ? -1 : i;

        svg
          .selectAll('path')
          .attr('class', (_, idx) => (idx === selectedIndex ? 'selected' : ''));
        d3.select('.legend')
          .selectAll('li')
          .attr('class', (_, idx) =>
            idx === selectedIndex ? 'legend-item selected' : 'legend-item'
          );

        let searchFiltered = getSearchFiltered();
        if (selectedIndex === -1) {
          renderProjects(searchFiltered, projectsContainer, 'h2');
        } else {
          let selectedYear = data[selectedIndex].label;
          renderProjects(
            searchFiltered.filter((p) => p.year === selectedYear),
            projectsContainer,
            'h2'
          );
        }
      });
  });
}

// Initial render
renderProjects(projects, projectsContainer, 'h2');
renderPieChart(projects);

let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('input', (event) => {
  query = event.target.value;
  // Reset pie selection when search changes so the two filters compose cleanly
  selectedIndex = -1;

  let filtered = getSearchFiltered();
  renderProjects(filtered, projectsContainer, 'h2');
  renderPieChart(filtered);
});
