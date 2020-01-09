class LiveChart_P_Light extends LiveChart {
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
          type: 'line',
          yAxisID: 'Pressure',
          label: 'Pressure',
          data: yvals1,
          backgroundColor: 'rgba(200, 214, 229, 0.1)',
          borderColor: '#c8d6e5',
          pointBackgroundColor: '#d1ccc0',
          order: 1
        },
        {
          yAxisID: 'Light',
          label: 'Light',
          data: yvals2,
          backgroundColor: 'rgba(255, 242, 0, 0.1)',
          borderColor: '#fff200',
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
              suggestedMin: 96000,
              suggestedMax: 106000,
            },
            gridLines: {
              color: 'rgba(255, 255, 255, 0.25)',
              lineWidth: 0.75
            },
            position: 'left'
          },
          {
            id: 'Light',
            scaleLabel: {
              display: true,
              labelString: 'Light (lux)',
              lineHeight: 2,
              fontSize: 17,
              fontColor: 'rgba(255, 255, 255, 0.7)',
            },
            ticks: {
              suggestedMin: 0,
              suggestedMax: 1000,
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
      super.unzoom(960, 1060, true, 0, 1000);
    else if (this.__config.options.scales.yAxes[0].scaleLabel.labelString.includes('kPa'))
      super.unzoom(96, 106, true, 0, 1000);
    else
      super.unzoom(96000, 106000, true, 0, 1000);
  }
}
