function saveLiveSettings(tiles) {
  const radios = tiles.map(el => document.getElementById(`display-${el}`));
  const json = {};
  tiles.forEach((el, i) => json[el] = radios[i].checked);
  window.localStorage.setItem('liveTiles', JSON.stringify(json));
  updateLiveTiles(tiles);
}

function updateLiveTiles(tiles) {
  const json = JSON.parse(window.localStorage.getItem('liveTiles'));
  const containers = tiles.map(el => document.getElementById(`live-container-${el}`));

  for (let key in json) {
    const i = tiles.indexOf(key);
    if (json[key])
      containers[i].classList.remove('hide');
    else
      containers[i].classList.add('hide');
  }

  // Adjust Graph
  const liveTile = document.getElementById('live-tile')
  const liveGraph = document.getElementById('live-graph');
  const charts = Array.from(liveGraph.children[0].children);

  let areTilesPresent = false;
  for (let key in json) {
    if (json[key]) {
      areTilesPresent = true;
      break;
    }
  }

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

function updateLiveSettings(tiles) {
  const json = JSON.parse(window.localStorage.getItem('liveTiles'));
  const radios = tiles.map(el => document.getElementById(`display-${el}`));

  for (let key in json) {
    const i = tiles.indexOf(key);
    radios[i].checked = json[key];
  }
}
