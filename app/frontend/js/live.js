class LiveCharts {
  constructor(data, liveTiles) {
    this.charts = {
      'T': new LiveChart_T('live-chart-temperature', data.dates, data.Averages.T_C),
      'HI': new LiveChart_HI('live-chart-heat-index', data.dates, data.DHT.HI_C),
      'RH': new LiveChart_RH('live-chart-humidity', data.dates, data.DHT.RH),
      'Rain': new LiveChart_Rain('live-chart-rain', data.dates, data.FC37.Rain),
      'Light': new LiveChart_Light('live-chart-light', data.dates, data.TEMT6000.Light),
      'T_HI': new LiveChart_T_HI('live-chart-temperature-heat-index', data.dates, data.Averages.T_C, data.DHT.HI_C),
      'T_RH': new LiveChart_T_RH('live-chart-temperature-humidity', data.dates, data.Averages.T_C, data.DHT.RH),
      'T_Rain': new LiveChart_T_Rain('live-chart-temperature-rain', data.dates, data.Averages.T_C, data.FC37.Rain),
      'T_Light': new LiveChart_T_Light('live-chart-temperature-light', data.dates, data.Averages.T_C, data.TEMT6000.Light),
      'HI_RH': new LiveChart_HI_RH('live-chart-heat-index-humidity', data.dates, data.DHT.HI_C, data.DHT.RH),
      'HI_Rain': new LiveChart_HI_Rain('live-chart-heat-index-rain', data.dates, data.DHT.HI_C, data.FC37.Rain),
      'HI_Light': new LiveChart_HI_Light('live-chart-heat-index-light', data.dates, data.DHT.HI_C, data.TEMT6000.Light),
      'Rain_RH': new LiveChart_Rain_RH('live-chart-rain-humidity', data.dates, data.FC37.Rain, data.DHT.RH),
      'Rain_Light': new LiveChart_Rain_Light('live-chart-rain-light', data.dates, data.FC37.Rain, data.TEMT6000.Light),
      'Light_RH': new LiveChart_Light_RH('live-chart-light-humidity', data.dates, data.TEMT6000.Light, data.DHT.RH)
    };

    this.data = data;
    this.liveTiles = liveTiles;
    this.sample = null;
    this.isCelsius = true;
    this.date = data['date'];  
    
    this.currentChart = this.charts['T'];
    this.chartLookupTable = {
      'temperature': this.charts['T'],
      'heat-index': this.charts['HI'],
      'humidity': this.charts['RH'],
      'rain': this.charts['Rain'],
      'light': this.charts['Light'],
      'temperature-heat-index': this.charts['T_HI'],
      'temperature-humidity': this.charts['T_RH'],
      'temperature-rain': this.charts['T_Rain'],
      'temperature-light': this.charts['T_Light'],
      'heat-index-humidity': this.charts['HI_RH'],
      'heat-index-rain': this.charts['HI_Rain'],
      'heat-index-light': this.charts['HI_Light'],
      'rain-humidity': this.charts['Rain_RH'],
      'rain-light': this.charts['Rain_Light'],
      'light-humidity': this.charts['Light_RH']
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
  }
  
  updateGraph(sample) {
    this.sample = sample;
    const date_ = new Date(sample['date']);
    
    if (this.isCelsius) {
      this.charts['T'].addDataPoint(date_, sample['T']['C']);
      this.charts['HI'].addDataPoint(date_, sample['DHT']['HI_C']);
      this.charts['T_HI'].addDataPoint(date_, sample['T']['C'], sample['DHT']['HI_C']);
      this.charts['T_RH'].addDataPoint(date_, sample['T']['C'], sample['DHT']['RH']);
      this.charts['T_Rain'].addDataPoint(date_, sample['T']['C'], sample['FC37']['Rain']);
      this.charts['T_Light'].addDataPoint(date_, sample['DHT']['RH']);
      this.charts['HI_RH'].addDataPoint(date_, sample['DHT']['HI_C'], sample['DHT']['RH']);
      this.charts['HI_Rain'].addDataPoint(date_, sample['DHT']['HI_C'], sample['DHT']['RH']);
      this.charts['HI_Light'].addDataPoint(date_, sample['DHT']['HI_C'], sample['TEMT6000']['Lux']);
    } else {
      this.charts['T'].addDataPoint(date_, sample['T']['F']);
      this.charts['HI'].addDataPoint(date_, sample['DHT']['HI_F']);
      this.charts['T_HI'].addDataPoint(date_, sample['T']['F'], sample['DHT']['HI_F']);
      this.charts['T_RH'].addDataPoint(date_, sample['T']['F'], sample['DHT']['RH']);
      this.charts['T_Rain'].addDataPoint(date_,sample['T']['F'], sample['FC37']['Rain']);
      this.charts['HI_RH'].addDataPoint(date_, sample['DHT']['HI_F'], sample['DHT']['RH']);
      this.charts['HI_Rain'].addDataPoint(date_, sample['DHT']['HI_F'], sample['DHT']['RH']);
      this.charts['HI_Light'].addDataPoint(date_, sample['DHT']['HI_F'], sample['TEMT6000']['Lux']);
    }
    
    this.data.Averages.T_C.push({'x': date_, 'y': sample['T']['C']});
    this.data.Averages.T_F.push({'x': date_, 'y': sample['T']['F']});
    
    this.charts['RH'].addDataPoint(date_, sample['DHT']['RH']);
    this.charts['Rain'].addDataPoint(date_, sample['FC37']['Rain']);
    this.charts['Light'].addDataPoint(date_, sample['TEMT6000']['Lux']);
    this.charts['Rain_RH'].addDataPoint(date_, sample['FC37']['Rain'], sample['DHT']['RH']);
    this.charts['Rain_Light'].addDataPoint(date_, sample['FC37']['Rain'], sample['TEMT6000']['Light']);
    this.charts['Light_RH'].addDataPoint(date_, sample['TEMT6000']['Lux'], sample['DHT']['RH']);
  }
  
  updateLive(new_sample) {
    this.sample = new_sample;
    this.updateLiveTemperature();
    this.liveTiles['RH'].textContent = `${this.sample.DHT.RH}%`;
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

    const charts = ['T', 'T_HI', 'T_RH', 'T_Rain', 'T_Light', 'HI', 'HI_RH', 'HI_Rain', 'HI_Light'];
    const samples = isCelsius ? this.data.Averages.T_C : this.data.Averages.T_F;
    charts.forEach(chart => this.charts[chart].changeTemperatureUnit(samples));
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
