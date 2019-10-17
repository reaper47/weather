class LiveChart_HI_RH extends LiveChart {
  constructor(liveChartID, heatIndexData, humidityData) {
    super(liveChartID, heatIndexData, humidityData)
    this.__config = deepmerge(super.__baseConfig(), this.__init_config(heatIndexData, humidityData));
  }

  __init_config(heatIndexData, humidityData) {
    return {
      data: {
        datasets: [{
          yAxisID: 'HeatIndex',
          label: 'Heat Index',
          data: heatIndexData,
          borderColor: '#b33939',
          pointBackgroundColor: '#d1ccc0'
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
            id: 'Humidity',
            min: 0,
            max: 100,
            scaleLabel: {
              display: true,
              labelString: 'Humidity (%)',
              lineHeight: 2,
              fontSize: 17,
              fontColor: 'rgba(255, 255, 255, 0.7)'
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
