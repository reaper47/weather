class LiveChart_HI extends LiveChart {
  constructor(liveChartID, heatIndexData) {
    super(liveChartID, heatIndexData)
    this.__config = deepmerge(super.__baseConfig(), this.__init_config(heatIndexData));
  }

  __init_config(heatIndexData) {
    return {
      type: 'line',
      data: {
        datasets: [{
          yAxisID: 'HeatIndex',
          label: 'Heat Index',
          data: heatIndexData,
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
