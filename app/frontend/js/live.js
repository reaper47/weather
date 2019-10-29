class LiveCharts {
  constructor(data, liveTiles) {
    this.charts = {
      'T': new LiveChart_T('live-chart-temperature', data.dates, data.Averages.T_C),
      'HI': new LiveChart_HI('live-chart-heat-index', data.dates, data.DHT.HI_C),
      'RH': new LiveChart_RH('live-chart-humidity', data.dates, data.DHT.RH),
      'Rain': new LiveChart_Rain('live-chart-rain', data.dates, data.FC37.Rain),
      'Light': new LiveChart_Light('live-chart-light', data.dates, data.TEMT6000.Light),
      'P': new LiveChart_P('live-chart-pressure', data.dates, data.BME280.P),
      'T_HI': new LiveChart_T_HI('live-chart-temperature-heat-index', data.dates, data.Averages.T_C, data.DHT.HI_C),
      'T_RH': new LiveChart_T_RH('live-chart-temperature-humidity', data.dates, data.Averages.T_C, data.DHT.RH),
      'T_Rain': new LiveChart_T_Rain('live-chart-temperature-rain', data.dates, data.Averages.T_C, data.FC37.Rain),
      'T_Light': new LiveChart_T_Light('live-chart-temperature-light', data.dates, data.Averages.T_C, data.TEMT6000.Light),
      'T_P': new LiveChart_T_P('live-chart-temperature-pressure', data.dates, data.Averages.T_C, data.BME280.P),
      'HI_RH': new LiveChart_HI_RH('live-chart-heat-index-humidity', data.dates, data.DHT.HI_C, data.DHT.RH),
      'HI_Rain': new LiveChart_HI_Rain('live-chart-heat-index-rain', data.dates, data.DHT.HI_C, data.FC37.Rain),
      'HI_Light': new LiveChart_HI_Light('live-chart-heat-index-light', data.dates, data.DHT.HI_C, data.TEMT6000.Light),
      'HI_P': new LiveChart_HI_P('live-chart-heat-index-pressure', data.dates, data.DHT.HI_C, data.BME280.P),
      'Rain_RH': new LiveChart_Rain_RH('live-chart-rain-humidity', data.dates, data.FC37.Rain, data.DHT.RH),
      'Rain_Light': new LiveChart_Rain_Light('live-chart-rain-light', data.dates, data.FC37.Rain, data.TEMT6000.Light),
      'Light_RH': new LiveChart_Light_RH('live-chart-light-humidity', data.dates, data.TEMT6000.Light, data.DHT.RH),
      'P_RH': new LiveChart_P_RH('live-chart-pressure-humidity', data.dates, data.BME280.P, data.DHT.RH),
      'P_Rain': new LiveChart_P_Rain('live-chart-pressure-rain', data.dates, data.BME280.P, data.FC37.Rain),
      'P_Light': new LiveChart_P_Light('live-chart-pressure-light', data.dates, data.BME280.P, data.TEMT6000.Light)
    };

    this.data = data;
    this.liveTiles = liveTiles;
    this.sample = null;
    this.isCelsius = true;
    this.dates = data['dates'];
    
    this.temperatureSelectContainer = document.getElementById('live-sensors-temperature');
    this.humiditySelectContainer = document.getElementById('live-sensors-humidity');
    
    this.currentChart = this.charts['T'];
    this.chartLookupTable = {
      'temperature': this.charts['T'],
      'heat-index': this.charts['HI'],
      'humidity': this.charts['RH'],
      'rain': this.charts['Rain'],
      'light': this.charts['Light'],
      'pressure': this.charts['P'],
      'temperature-heat-index': this.charts['T_HI'],
      'temperature-humidity': this.charts['T_RH'],
      'temperature-rain': this.charts['T_Rain'],
      'temperature-light': this.charts['T_Light'],
      'temperature-pressure': this.charts['T_P'],
      'heat-index-humidity': this.charts['HI_RH'],
      'heat-index-rain': this.charts['HI_Rain'],
      'heat-index-light': this.charts['HI_Light'],
      'heat-index-pressure': this.charts['HI_P'],
      'rain-humidity': this.charts['Rain_RH'],
      'rain-light': this.charts['Rain_Light'],
      'light-humidity': this.charts['Light_RH'],
      'pressure-humidity': this.charts['P_RH'],
      'pressure-rain': this.charts['P_Rain'],
      'pressure-light': this.charts['P_Light']
    };
  }
  
  create() {
    Object.keys(this.charts).forEach(k => this.charts[k].create());
  }
  
  changeChart(chart, zoomButton) {
    this.currentChart = this.chartLookupTable[chart];

    Object.keys(this.charts).forEach(k => {
      zoomButton.textContent = 'Zoom';
      this.charts[k].unzoom();
      this.charts[k].hide();
    });

    this.currentChart.show();
    this.toggleSensorSelect(chart);
  }
  
  toggleSensorSelect(chart) {
    const isTemperature = chart.includes('temperature');
    const isHumidity = chart.includes('humidity');
  
    if (isTemperature && isHumidity) {
      this.temperatureSelectContainer.classList.remove('hide');
      this.humiditySelectContainer.classList.remove('hide');
    } else if (isTemperature) {
      this.temperatureSelectContainer.classList.remove('hide');
      this.humiditySelectContainer.classList.add('hide');
    } else if (isHumidity) {
      this.temperatureSelectContainer.classList.add('hide');
      this.humiditySelectContainer.classList.remove('hide');
    } else {
      this.temperatureSelectContainer.classList.add('hide');
      this.humiditySelectContainer.classList.add('hide');
    }
  }
  
  changeSensorT(sensor) {
    const charts = ['T', 'HI', 'T_RH', 'T_Rain', 'T_Light', 'T_P', 'T_HI'];  

    if (sensor.includes('dht')) {
      const temperatures = this.isCelsius ? this.data.DHT.T_C : this.data.DHT.T_F;
      charts.forEach(chart => this.charts[chart].changeDataset(temperatures));
    } else if (sensor.includes('ds18')) {
      const temperatures = this.isCelsius ? this.data.DS18B20.T_C : this.data.DS18B20.T_F;
      charts.forEach(chart => this.charts[chart].changeDataset(temperatures));
    } else if (sensor.includes('bme')) {
      const temperatures = this.isCelsius ? this.data.BME280.T_C : this.data.BME280.T_F;
      charts.forEach(chart => this.charts[chart].changeDataset(temperatures));
      this.charts['T_HI'].changeDataset(temperatures);
    } else {
      const temperatures = this.isCelsius ? this.data.Averages.T_C : this.data.Averages.T_F;
      charts.forEach(chart => this.charts[chart].changeDataset(temperatures));
    }
  }
  
  changeSensorRH(sensor) {
    const charts = ['Rain_RH', 'Light_RH', 'P_RH', 'T_HI', 'T_RH', 'HI_RH'];
    
    if (sensor.includes('dht')) {
      this.charts['RH'].changeDataset(this.data.DHT.RH);
      charts.forEach(chart => this.charts[chart].changeDataset(null, this.data.DHT.RH));
    } else if (sensor.includes('bme')) {
      this.charts['RH'].changeDataset(this.data.BME280.RH);
      charts.forEach(chart => this.charts[chart].changeDataset(null, this.data.BME280.RH));
    }
  }
  
  updateGraph(sample) {
    this.sample = sample;
    const date_ = new Date(sample['date']);
    
    if (this.isCelsius) {
      this.charts['T'].addDataPoint(date_, sample.T.C);
      this.charts['HI'].addDataPoint(date_, sample.DHT.HI_C);
      this.charts['T_HI'].addDataPoint(date_, sample.T.C, sample.DHT.HI_C);
      this.charts['T_RH'].addDataPoint(date_, sample.T.C, sample.DHT.RH);
      this.charts['T_Rain'].addDataPoint(date_, sample.T.C, sample.FC37.rain);
      this.charts['T_Light'].addDataPoint(date_, sample.T.C, sample.TEMT6000.lux);
      this.charts['T_P'].addDataPoint(date_, sample.T.C, sample.BME280.P);
      this.charts['HI_RH'].addDataPoint(date_, sample.DHT.HI_C, sample.DHT.RH);
      this.charts['HI_Rain'].addDataPoint(date_, sample.DHT.HI_C, sample.FC37.rain);
      this.charts['HI_Light'].addDataPoint(date_, sample.DHT.HI_C, sample.TEMT6000.lux);
      this.charts['HI_P'].addDataPoint(date_, sample.DHT.HI_C, sample.BME280.P);
    } else {
      this.charts['T'].addDataPoint(date_, sample.T.F);
      this.charts['HI'].addDataPoint(date_, sample.DHT.HI_F);
      this.charts['T_HI'].addDataPoint(date_, sample.T.F, sample.DHT.HI_F);
      this.charts['T_RH'].addDataPoint(date_, sample.T.F, sample.DHT.RH);
      this.charts['T_Rain'].addDataPoint(date_,sample.T.F, sample.FC37.rain);
      this.charts['T_P'].addDataPoint(date_, sample.T.F, sample.BME280.P);
      this.charts['HI_RH'].addDataPoint(date_, sample.DHT.HI_F, sample.DHT.RH);
      this.charts['HI_Rain'].addDataPoint(date_, sample.DHT.HI_F, sample.FC37.rain);
      this.charts['HI_Light'].addDataPoint(date_, sample.DHT.HI_F, sample.TEMT6000.lux);
      this.charts['HI_P'].addDataPoint(date_, sample.DHT.HI_F, sample.BME280.P);
    }
    
    this.charts['RH'].addDataPoint(date_, sample.DHT.RH);
    this.charts['Rain'].addDataPoint(date_, sample.FC37.rain);
    this.charts['Light'].addDataPoint(date_, sample.TEMT6000.lux);
    this.charts['P'].addDataPoint(date_, sample.BME280.P);
    this.charts['Rain_RH'].addDataPoint(date_, sample.FC37.rain, sample.DHT.RH);
    this.charts['Rain_Light'].addDataPoint(date_, sample.FC37.rain, sample.TEMT6000.lux);
    this.charts['Light_RH'].addDataPoint(date_, sample.TEMT6000.lux, sample.DHT.RH);
    this.charts['P_RH'].addDataPoint(date_, sample.BME280.P, sample.DHT.RH);
    this.charts['P_Rain'].addDataPoint(date_, sample.BME280.P, sample.FC37.rain);
    this.charts['P_Light'].addDataPoint(date_, sample.BME280.P, sample.TEMT6000.lux);
    
    this.dates.push(date_);
  }
  
  updateLive(new_sample) {
    this.sample = new_sample;
    this.updateLiveTemperature();
    this.liveTiles['RH'].textContent = `${this.sample.DHT.RH}%`;
    this.liveTiles['Light'].textContent = `${this.sample.TEMT6000.lux}`;
    this.liveTiles['Rain'].textContent = `${this.labelRain(this.sample.FC37.rain)}`;
    this.liveTiles['P'].textContent = `${this.numberWithCommas(this.sample.BME280.P.toFixed(0))} Pa`;
  }
  
  labelRain(char) {
    if (char.localeCompare('N') === 0) 
      return 'None';
    else if (char.localeCompare('L') === 0)
      return 'Light';
    else if (char.localeCompare('M') === 0)
      return 'Moderate';
    else if (char.localeCompare('H') === 0)
      return 'Heavy';
  }
  
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  
  updateLiveTemperature() {
    if (this.isCelsius) {
      this.liveTiles['T'].textContent = `${this.sample.T.C}°C`;
      this.liveTiles['HI'].textContent = `${this.sample.DHT.HI_C}°C`;
    } else {
      this.liveTiles['T'].textContent = `${this.sample.T.F}°F`;
      this.liveTiles['HI'].textContent = `${this.sample.DHT.HI_F}°F`;
    }
  }

  updateTemperatureUnit(isCelsius) {
    this.isCelsius = isCelsius;
    
    if (this.sample)
      this.updateLiveTemperature(isCelsius, this.sample);

    const charts = ['T', 'T_RH', 'T_Rain', 'T_Light', 'T_P', 'HI', 'HI_RH', 'HI_Rain', 'HI_Light', 'HI_P'];
    const samples = isCelsius ? this.data.Averages.T_C : this.data.Averages.T_F;
    charts.forEach(chart => this.charts[chart].changeTemperatureUnit(samples));
    
    const heatIndexSamples = isCelsius ? this.data.DHT.HI_C : this.data.DHT.HI_F;
    this.charts['T_HI'].changeTemperatureUnit(samples, heatIndexSamples);
  }
  
  zoomChart(zoomButton) {
    if (zoomButton.textContent.localeCompare('Zoom') == 0) {
      zoomButton.textContent = 'Unzoom';
      this.currentChart.zoom();
    } else {
      zoomButton.textContent = 'Zoom';
      this.currentChart.unzoom();
    }
  }
}
