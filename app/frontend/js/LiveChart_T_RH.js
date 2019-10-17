class LiveChart_T_RH extends LiveChart {
  constructor(liveChartID, temperatureData, humidityData) {
    super(liveChartID, temperatureData, humidityData)
    this.__config = deepmerge(super.__baseConfig(), this.__init_config(temperatureData, humidityData));
  }

  __init_config(temperatureData, humidityData) {
    return {
      data: {
        datasets: [{
          yAxisID: 'Temperature',
          label: 'Temperature',
          data: temperatureData,
          borderColor: '#218c74',
          pointBackgroundColor: '#d1ccc0',
        },
        {
          yAxisID: 'Humidity',
          label: 'Humidity',
          data: humidityData,
          borderColor: '#34ace0',
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
              suggestedMax: 100,
            },
            gridLines: {
              color: 'rgba(255, 255, 255, 0.25)',
              lineWidth: 0.75
            },
            position: 'left'
          },
          {
            id: 'Humidity',
            min: 0,
            max: 100,
            scaleLabel: {
              display: true,
              labelString: 'Humidity (%)',
              lineHeight: 2,
              fontSize: 17,
              fontColor: 'rgba(255, 255, 255, 0.7)',
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
  
  zoom() {
    super.zoom(true);
  }
  
  unzoom() {
    super.unzoom(0, 100, true, 0, 100);
  }
}
