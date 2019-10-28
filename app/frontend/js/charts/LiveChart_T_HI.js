class LiveChart_T_HI extends LiveChart {
  constructor(liveChartID, xvals, yvals1, yvals2) {
    super(liveChartID, yvals1, yvals2)
    this.__config = deepmerge(super.__baseConfig(), this.__init_config(xvals, yvals1, yvals2));
  }

  __init_config(xvals, yvals1, yvals2) {
    return {
      type: 'line',
      data: {
        labels: xvals,
        datasets: [{
          yAxisID: 'Temperature',
          label: 'Temperature',
          data: yvals1,
          borderColor: '#218c74',
          pointBackgroundColor: '#d1ccc0'
        },
        {
          yAxisID: 'HeatIndex',
          label: 'Heat Index',
          data: yvals2,
          borderColor: '#b33939',
          pointBackgroundColor: '#d1ccc0',
        }]
      },
      options: {
        scales: {
          yAxes: [{
            id: 'Temperature',
            scaleLabel: {
              display: true,
              labelString: 'Temperature (°C)',
              lineHeight: 2,
              fontSize: 17,
              fontColor: 'rgba(255, 255, 255, 0.7)',
            },
            ticks: {
              fontColor: 'rgba(255, 255, 255, 0.7)',
              maxTicksLimit: 20,
              suggestedMax: 100,
            },
            gridLines: {
              color: 'rgba(255, 255, 255, 0.25)',
              lineWidth: 0.75
            },
            position: 'left'
          },
          {
            id: 'HeatIndex',
            min: 0,
            max: 100,
            scaleLabel: {
              display: true,
              labelString: 'Heat Index (°C)',
              lineHeight: 2,
              fontSize: 17,
              fontColor: 'rgba(255, 255, 255, 0.7)'
            },
            ticks: {
              fontColor: 'rgba(255, 255, 255, 0.7)',
              suggestedMin: 0,
              suggestedMax: 100,
            },
            gridLines: {
              color: 'rgba(255, 255, 255, 0.25)',
              zeroLineColor: 'rgba(255, 255, 255, 0.25)',
              lineWidth: 0.75
            },
            position: 'right'
          }]
        }
      }
    }
  }
  
  changeTemperatureUnit(samples, heatIndexSamples) {
    super.changeTemperatureUnit(samples);
    this.__config.data.datasets[1].data = heatIndexSamples;
    
    const heatLabel = this.__config.options.scales.yAxes[1].scaleLabel.labelString;
    if (heatLabel.includes('°C'))
      this.__config.options.scales.yAxes[1].scaleLabel.labelString = 'Heat Index (°F)';
    else
      this.__config.options.scales.yAxes[1].scaleLabel.labelString = 'Heat Index (°C)';
    
    this.chart.update();
  }
  
  zoom() {
    super.zoom(true);
  }
  
  unzoom() {
    super.unzoom(0, 100, true, 0, 100);
  }
}
