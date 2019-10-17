class LiveChart_T extends LiveChart {
  constructor(liveChartID, temperatureData) {
    super(liveChartID, temperatureData)
    this.__config = deepmerge(super.__baseConfig(), this.__init_config(temperatureData));
  }

  __init_config(temperatureData) {
    return {
      type: 'line',
      data: {
        datasets: [{
          yAxisID: 'Temperature',
          label: 'Temperature',
          data: temperatureData,
          fill: true,
          backgroundColor: 'rgba(51, 217, 178,0.1)',
          borderColor: '#218c74',
          pointBackgroundColor: '#d1ccc0'
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
