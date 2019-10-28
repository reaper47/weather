function displayLiveComponents(components, json) {
  // Adjust Live Tiles
  const containers = components.map(el => document.getElementById(`live-container-${el}`));
  for (let key in json) {
    const i = components.indexOf(key);
    if (json[key])
      containers[i].classList.remove('hide');
    else
      containers[i].classList.add('hide');
  }

  // Adjust Graph
  let areTilesPresent = false;
  for (let key in json) {
    if (json[key]) {
      areTilesPresent = true;
      break;
    }
  }

  const liveTile = document.getElementById('live-tile')
  const liveGraph = document.getElementById('live-graph');
  const charts = Array.from(liveGraph.children[0].children);
  if (!areTilesPresent) {
    liveTile.classList.add('hide');
    liveGraph.classList.remove('is-10');
    liveGraph.classList.add('is-full');
    charts.forEach(el => el.style.width = '100%');
  } else {
    liveTile.classList.remove('hide');
    liveGraph.classList.add('is-10');
    liveGraph.classList.remove('is-full');
    charts.forEach(el => el.style.width = null);
  }
}
