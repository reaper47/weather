class LiveChart_HI extends LiveChart {
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
          yAxisID: 'HeatIndex',
          label: 'Heat Index',
          data: yvals,
          fill: true,
          backgroundColor: 'rgba(255, 82, 82, 0.1)',
          borderColor: '#b33939',
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
              suggestedMin: 0,
              suggestedMax: 100
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
    super.unzoom(0, 100);
  }
}
