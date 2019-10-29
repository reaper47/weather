class LiveChart {
  constructor(liveChartID) {
    this.__container = document.getElementById(liveChartID + '__container');
    this.__liveChartID = liveChartID;
    this.__ctx = document.getElementById(liveChartID).getContext('2d');
  }

  __baseConfig() {
    return { 
      options: {
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              min: new Date().setHours(0, 0, 0, 0),
              unit: 'hour'
            },
            scaleLabel: {
              display: true,
            },
            gridLines: {
              color: 'rgba(255, 255, 255, 0.25)',
              lineWidth: 0.75,
            },
            ticks: {
              fontColor: 'rgba(255, 255, 255, 0.7)'
            }
          }]
        }
      },
      plugins: [{
        afterDatasetsDraw: (chart) => {
          if (chart.tooltip._active && chart.tooltip._active.length) {
            const activePoint = chart.tooltip._active[0]
            let y_axis = chart.scales[Object.keys(chart.scales)[1]];
              
            const x = activePoint.tooltipPosition().x
            this.__ctx.save();
            this.__ctx.beginPath();
            this.__ctx.moveTo(x, y_axis.top);
            this.__ctx.lineTo(x, y_axis.bottom)
            this.__ctx.lineWidth = 1;
            this.__ctx.strokeStyle = '#ffda79';
            this.__ctx.stroke();
            this.__ctx.restore();
          }
        }
      }]
    }
  }

  create() {
    this.chart = new Chart(this.__ctx, this.__config)
  }

  addDataPoint(time, y1, y2 = null) {
    this.__config.data.labels.push(time)
    this.__config.data.datasets[0].data.push(y1)
    
    if (y2)
      this.__config.data.datasets[1].data.push(y2)

    this.chart.update()
  }
    
  labelRain(value) {
    if (value === 0) 
      return 'None';
    else if (value === 1)
      return 'Light';
    else if (value === 2)
      return 'Moderate';
    else if (value === 3)
      return 'Heavy';
  }
  
  rainToNumber(value) {
    if (value.localeCompare('N') === 0) 
      return 0;
    else if (value.localeCompare('L') === 0)
      return 1;
    else if (value.localeCompare('M') === 0)
      return 2;
    else if (value.localeCompare('H') === 0)
      return 3;
  }
  
  changeDataset(y1 = null, y2 = null) {
    if (y1)
      this.__config.data.datasets[0].data = y1;
    
    if (y2)
      this.__config.data.datasets[1].data = y2;
    
    this.chart.update();
  }

  changeTemperatureUnit(samples) {
    this.__config.data.datasets[0].data = samples;
    
    const ylabel = this.__config.options.scales.yAxes[0].scaleLabel.labelString;
    if (ylabel.includes('°C'))
      this.__config.options.scales.yAxes[0].scaleLabel.labelString = 'Temperature (°F)';
    else
      this.__config.options.scales.yAxes[0].scaleLabel.labelString = 'Temperature (°C)';
      
    this.chart.update();
  }
  
  show() {
    this.__container.classList.remove('hide')
  }
  
  hide() {
    this.__container.classList.add('hide')
  }
  
  zoom(multipleYAxis = false) {
    delete this.__config.options.scales.yAxes[0].ticks.suggestedMin;
    delete this.__config.options.scales.yAxes[0].ticks.suggestedMax;
    
    if (multipleYAxis) {
      delete this.__config.options.scales.yAxes[1].ticks.suggestedMin;
      delete this.__config.options.scales.yAxes[1].ticks.suggestedMax;
    }
    
    this.chart.update();
  }
  
  unzoom(min, max, multipleYAxis = false, min2, max2) {
    this.__config.options.scales.yAxes[0].ticks.suggestedMin = min;
    this.__config.options.scales.yAxes[0].ticks.suggestedMax = max;
    
    if (multipleYAxis) {
      this.__config.options.scales.yAxes[1].ticks.suggestedMin = min2;
      this.__config.options.scales.yAxes[1].ticks.suggestedMax = max2;
    }
    
    this.chart.update();
  }
}
