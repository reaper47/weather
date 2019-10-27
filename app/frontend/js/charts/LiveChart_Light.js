class LiveChart_Light extends LiveChart {
  constructor(liveChartID, xvals, yvals) {
    super(liveChartID)
    this.__config = deepmerge(super.__baseConfig(), this.__init_config(xvals, yvals));
  }

  __init_config(xvals, yvals) {
    return {
      type: 'line',
      data: {
        labels: xvals,
        datasets: [{
          yAxisID: 'Light',
          label: 'Light',
          data: yvals,
          fill: true,
          backgroundColor: 'rgba(255, 242, 0, 0.1)',
          borderColor: '#fff200',
          pointBackgroundColor: '#d1ccc0'
        }]
      },
      options: {
        scales: {
          yAxes: [{
            id: 'Light',
            scaleLabel: {
              display: true,
              labelString: 'Light (lux)',
              lineHeight: 2,
              fontSize: 17,
              fontColor: 'rgba(255, 255, 255, 0.7)',
            },
            ticks: {
              fontColor: 'rgba(255, 255, 255, 0.7)',
              suggestedMin: 0,
              suggestedMax: 1000
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
    super.unzoom(0, 1000);
  }
}
