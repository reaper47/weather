class LiveChart_P extends LiveChart {
  constructor(liveChartID, xvals, yvals) {
    super(liveChartID);
    this.__config = deepmerge(super.__baseConfig(), this.__init_config(xvals, yvals));
  }

  __init_config(xvals, yvals) {
    return {
      type: 'line',
      data: {
        labels: xvals,
        datasets: [{
          yAxisID: 'Pressure',
          label: 'Pressure',
          data: yvals,
          fill: true,
          backgroundColor: 'rgba(200, 214, 229, 0.1)',
          borderColor: '#c8d6e5',
          pointBackgroundColor: '#d1ccc0'
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
              beginAtZero: false
            },
            gridLines: {
              color: 'rgba(255, 255, 255, 0.25)',
              lineWidth: 0.75
            },
            position: 'left'
          }]
        }
      }
    }
  }

  unzoom() {
    if (this.__config.options.scales.yAxes[0].scaleLabel.labelString.includes('mbar'))
      super.unzoom(900, 1100);
    else if (this.__config.options.scales.yAxes[0].scaleLabel.labelString.includes('kPa'))
      super.unzoom(90, 110);
    else
      super.unzoom(90000, 110000);
  }
}
