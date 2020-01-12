(async () => {
  const template = await fetch('templates/projects.mst').then(response => response.text());
  const projects = await fetch('data/projects.json').then(response => response.json());

  document.getElementById('projects').innerHTML = Mustache.render(template, projects);
})();
