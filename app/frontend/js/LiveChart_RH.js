class LiveChart_RH extends LiveChart {
  constructor(liveChartID, humidityData) {
    super(liveChartID, humidityData)
    this.__config = deepmerge(super.__baseConfig(), this.__init_config(humidityData));
  }

  __init_config(humidityData) {
    return {
      type: 'line',
      data: {
        datasets: [{
          yAxisID: 'Humidity',
          label: 'Humidity',
          data: humidityData,
          fill: true,
          backgroundColor: 'rgba(52, 172, 224, 0.1)',
          borderColor: '#34ace0',
          pointBackgroundColor: '#d1ccc0'
        }]
      },
      options: {
        scales: {
          yAxes: [{
            id: 'Humidity',
            scaleLabel: {
              display: true,
              labelString: 'Humidity (%)',
              lineHeight: 2,
              fontSize: 18,
              fontColor: 'rgba(255, 255, 255, 0.7)',
            },
            ticks: {
              fontColor: 'rgba(255, 255, 255, 0.7)',
              suggestedMin: 0,
              suggestedMax: 100
              
            },
            gridLines: {
              color: 'rgba(255, 255, 255, 0.2)',
              lineWidth: 0.75,
              zeroLineColor: 'rgba(255, 255, 255, 0.2)'
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
