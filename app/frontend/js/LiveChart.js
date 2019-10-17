class LiveChart {
  constructor(liveChartID, temperatureData, humidityData = null) {
    this.__container = document.getElementById(liveChartID + '__container');
    this.__liveChartID = liveChartID;
    this.__ctx = document.getElementById(liveChartID).getContext('2d');
  }

  __baseConfig() {
    return { 
      type: 'line',
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
            let y_axis;
            if (chart.scales.Temperature)
              y_axis = chart.scales.Temperature
            else if (chart.scales.Humidity)
              y_axis = chart.scales.Humidity
            else
              y_axis = chart.scales.HeatIndex
              
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
    const y1Point = {x: time, y: y1};
    this.__config.data.datasets[0].data.push(y1Point)
    
    if (!!y2) {
      const y2point = {x: time, y: y2};
      this.__config.data.datasets[1].data.push(y2point)
    }

    this.chart.update()
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
