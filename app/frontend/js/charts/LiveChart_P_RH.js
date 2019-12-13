class LiveChart_P_RH extends LiveChart {
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
          yAxisID: 'Pressure',
          label: 'Pressure',
          data: yvals1,
          backgroundColor: 'rgba(200, 214, 229, 0.1)',
          borderColor: '#c8d6e5',
          pointBackgroundColor: '#d1ccc0',
          order: 1
        },
        {
          yAxisID: 'Humidity',
          label: 'Humidity',
          data: yvals2,
          backgroundColor: 'rgba(52, 172, 224, 0.1)',
          borderColor: '#34ace0',
          pointBackgroundColor: '#d1ccc0',
          order: 2
        }]
      },
      options: {
        scales: {
          yAxes: [{
            id: 'Pressure',
            scaleLabel: {
              display: true,
              labelString: 'Pressure (Pa)',
              lineHeight: 2,
              fontSize: 17,
              fontColor: 'rgba(255, 255, 255, 0.7)',
            },
            ticks: {
              fontColor: 'rgba(255, 255, 255, 0.7)',
              suggestedMin: 90000,
              suggestedMax: 110000,
            },
            gridLines: {
              color: 'rgba(255, 255, 255, 0.25)',
              lineWidth: 0.75
            },
            position: 'left'
          },
          {
            id: 'Humidity',
            scaleLabel: {
              display: true,
              labelString: 'Humidity (%)',
              lineHeight: 2,
              fontSize: 17,
              fontColor: 'rgba(255, 255, 255, 0.7)',
            },
            ticks: {
              suggestedMin: 0,
              suggestedMax: 100,
              fontColor: 'rgba(255, 255, 255, 0.7)',
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
      super.unzoom(900, 1100, true, 0, 100);
    else if (this.__config.options.scales.yAxes[0].scaleLabel.labelString.includes('kPa'))
      super.unzoom(90, 110, true, 0, 100);
    else
      super.unzoom(90000, 110000, true, 0, 100);
  }
}
