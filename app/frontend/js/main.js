const PressureUnitsEnum = Object.freeze({'pascal': 0, 'kilopascal': 1, 'mbar': 2});
const liveJson = 'liveTiles';
const unitsJson = 'units';
var liveCharts;

function main(samples, socketAddress) {
  samples['dates'] = samples['dates'].map(x => new Date(x));

  const liveTiles = {
    'T': document.getElementById('live-temperature'),
    'HI': document.getElementById('live-heat-index'),
    'RH': document.getElementById('live-humidity'),
    'Light': document.getElementById('live-lux'),
    'Rain': document.getElementById('live-rain'),
    'P': document.getElementById('live-pressure'),
  }

  liveCharts = new LiveCharts(samples, liveTiles);
  liveCharts.create();

  // Establish the sockets
  const socket = io.connect(socketAddress);
  socket.on('update_graph', sample => liveCharts.updateGraph(sample));
  socket.on('update_live', sample => liveCharts.updateLive(sample));

  // Event listeners
  refreshAtMidnightTimer();

  const liveChartSelect = document.getElementById('live-chart-select');
  liveChartSelect.selectedIndex = 0;
  liveChartSelect.addEventListener('change', opt => liveCharts.changeChart(opt.target.value, liveZoomButton));

  const liveSensorsTemperatureSelect = document.getElementById('live-sensors-temperature').firstElementChild;
  liveSensorsTemperatureSelect.addEventListener('change', opt => liveCharts.changeSensorT(opt.target.value));

  const liveSensorsHumiditySelect = document.getElementById('live-sensors-humidity').firstElementChild;
  liveSensorsTemperatureSelect.selectedIndex = 0;
  liveSensorsHumiditySelect.addEventListener('change', opt => liveCharts.changeSensorRH(opt.target.value));

  const liveZoomButton = document.getElementById('live-zoom-button');
  liveSensorsHumiditySelect.selectedIndex = 0;
  liveZoomButton.addEventListener('mousedown', click => liveCharts.zoomChart(click.target));

  loadLiveSettings();
}


function loadLiveSettings() {
  const liveTiles = ['temperature', 'heat-index', 'humidity', 'lux', 'rain', 'pressure'];

  if (window.localStorage.getItem(liveJson)) {
    updateLiveSettings(liveTiles);
    updateLiveTiles(liveTiles);
  }

  updateUnits();
  document.getElementById('save-live-settings').addEventListener('mousedown', () => saveLiveSettings(liveTiles));
  document.getElementById('cancel-live-settings').addEventListener('click', () => updateLiveSettings(liveTiles));
}


function saveLiveSettings(tiles) {
  const radios = tiles.map(el => document.getElementById(`display-${el}`));
  let json = {};
  tiles.forEach((el, i) => json[el] = radios[i].checked);
  window.localStorage.setItem(liveJson, JSON.stringify(json));
  updateLiveTiles(tiles);

  json = {};
  json['P'] = document.getElementById('pressure-unit').value;
  json['isCelsius'] = document.getElementById('temperature-unit').value.includes('celsius');
  window.localStorage.setItem(unitsJson, JSON.stringify(json));
  updateUnits();
}


function updateUnits() {
  const json = JSON.parse(window.localStorage.getItem(unitsJson));
  const temperatureUnit = document.getElementById('temperature-unit');
  const pressureUnit = document.getElementById('pressure-unit');

  if (json) {
    temperatureUnit.selectedIndex = json['isCelsius'] ? 0 : 1;
    pressureUnit.selectedIndex = PressureUnitsEnum[json['P']];
    liveCharts.updateTemperatureUnit(json['isCelsius']);
    liveCharts.updatePressureUnit(pressureUnit.value);
  } else {
    temperatureUnit.selectedIndex = 0;
    pressureUnit.selectedIndex = 0;
  }
}


function updateLiveTiles(tiles) {
  const json = JSON.parse(window.localStorage.getItem(liveJson));
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
  const json = JSON.parse(window.localStorage.getItem(liveJson));
  const radios = tiles.map(el => document.getElementById(`display-${el}`));
  for (let key in json) {
    const i = tiles.indexOf(key);
    radios[i].checked = json[key];
  }
}


function refreshAtMidnightTimer() {
  (function loop() {
    let now = new Date();
    const minutes = now.getMinutes();
    if (now.getHours() === 0 && minutes >= 0 && minutes <= 10)
      location.reload();
    now = new Date();
    const delay = 450000 - (now % 450000);
    setTimeout(loop, delay);
  })();
}
