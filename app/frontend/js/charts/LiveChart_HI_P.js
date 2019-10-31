class LiveChart_HI_P extends LiveChart {
  constructor(liveChartID, xvals, yvals1, yvals2) {
    super(liveChartID, yvals1, yvals2);
    this.__config = deepmerge(super.__baseConfig(), this.__init_config(xvals, yvals1, yvals2));
  }

  __init_config(xvals, yvals1, yvals2) {
    return {
      type: 'line',
      data: {
        labels: xvals,
        datasets: [{
          yAxisID: 'HeatIndex',
          label: 'Heat Index',
          data: yvals1,
          borderColor: '#b33939',
          pointBackgroundColor: '#d1ccc0'
        },
        {
          yAxisID: 'Pressure',
          label: 'Pressure',
          data: yvals2,
          backgroundColor: 'rgba(200, 214, 229, 0.1)',
          borderColor: '#c8d6e5',
          pointBackgroundColor: '#d1ccc0'
        }]
      },
      options: {
        scales: {
          yAxes: [{
            id: 'HeatIndex',
            scaleLabel: {
              display: true,
              labelString: 'Heat Index (°C)',
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
            id: 'Pressure',
            min: 0,
            max: 100,
            scaleLabel: {
              display: true,
              labelString: 'Pressure (Pa)',
              lineHeight: 2,
              fontSize: 17,
              fontColor: 'rgba(255, 255, 255, 0.7)'
            },
            ticks: {
              fontColor: 'rgba(255, 255, 255, 0.7)',
              suggestedMin: 90000,
              suggestedMax: 110000,
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
    
  zoom() {
    super.zoom(true);
  }
  
  unzoom() {
    if (this.__config.options.scales.yAxes[0].scaleLabel.labelString.includes('mbar'))
      super.unzoom(0, 100, true, 900, 1100);
    else if (this.__config.options.scales.yAxes[0].scaleLabel.labelString.includes('kPa'))
      super.unzoom(0, 100, true, 90, 110);
    else
      super.unzoom(0, 100, true, 90000, 110000);
  }
}
