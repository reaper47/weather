class LiveChart {
  constructor(temperatureData, humidityData) {
    const __liveChartCtxId = 'live-chart'
    
    this.__ctx = document.getElementById(__liveChartCtxId).getContext('2d')
    this.__config = this.__init_config(temperatureData, humidityData)
  }
  
  __init_config(temperatureData, humidityData) {
    return {
      type: 'line',
      data: {
        datasets: [{
          yAxisID: 'Temperature',
          label: 'Temperature',
          data: temperatureData,
          borderColor: '#d91e18',
          borderWidth: 2,
          fill: false,
          pointBackgroundColor: '#d91e18',
          pointBorderWidth: 1,
          pointHitRadius: 5,
          pointHoverBorderWidth: 3,
        },
        {
          yAxisID: 'Humidity',
          label: 'Humidity',
          data: humidityData,
          borderColor: '#19b5fe',
          borderWidth: 2,
          fill: false,
          pointBackgroundColor: '#19b5fe',
          pointBorderWidth: 1,
          pointHitRadius: 5,
          pointHoverBorderWidth: 2,
        }]
      },
      options: {
        layout: {
          padding: {
            right: 10,
          }
        },
        legend: {
          position: 'top',
          labels: {
            fontSize: 14,
            fontColor: 'rgba(255, 255, 255, 0.7)'
          }
        },
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            id: 'Temperature',
            scaleLabel: {
              display: true,
              labelString: 'Temperature (°C)',
              lineHeight: 2,
              fontSize: 16,
              fontColor: 'rgba(255, 255, 255, 0.7)',
            },
            ticks: {
              beginAtZero: true,
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
              fontSize: 16,
              fontColor: 'rgba(255, 255, 255, 0.7)',
            },
            ticks: {
              beginAtZero: true,
              fontColor: 'rgba(255, 255, 255, 0.7)',
              maxTicksLimit: 20,
              suggestedMax: 100,
            },
            gridLines: {
              color: 'rgba(255, 255, 255, 0.25)',
              zeroLineColor: 'rgba(255, 255, 255, 0.25)',
              lineWidth: 0.75
            },
            position: 'right'
          }],
          xAxes: [{
            type: 'time',
            time: {
              min: new Date().setHours(0, 0, 0, 0),
              unit: 'hour'
            },
            scaleLabel: {
              display: true,
            },
            gridLines: {
              color: 'rgba(255, 255, 255, 0.2)',
              lineWidth: 0.75,

            },
            ticks: {
              fontColor: 'rgba(255, 255, 255, 0.7)'
            }
          }]
        },
        tooltips: {
          mode: 'label',
          intersect: false,
          bodyFontSize: 14,
          bodySpacing: 6,
          titleFontSize: 14,
          yPadding: 10,
          xPadding: 10
        },
      },
      plugins: [{
        afterDatasetsDraw: (chart) => {
          if (chart.tooltip._active && chart.tooltip._active.length) {
            const activePoint = chart.tooltip._active[0]
            const y_axis = chart.scales.Temperature
            const x = activePoint.tooltipPosition().x
            this.__ctx.save();
            this.__ctx.beginPath();
            this.__ctx.moveTo(x, y_axis.top);
            this.__ctx.lineTo(x, y_axis.bottom)
            this.__ctx.lineWidth = 1;
            this.__ctx.strokeStyle = '#013243';
            this.__ctx.stroke();
            this.__ctx.restore();
          }
        }
      }]
    }
  }
  
  create() {
    this.chart = new Chart(this.__ctx, this.__config)
  }
  
  addDataPoint(time, temperature, humidity) {
    const humidityPoint = {x: time, y: humidity}
    const temperaturePoint = {x: time, y: temperature}
    
    this.__config.data.datasets[0].data.push(temperaturePoint)
    this.__config.data.datasets[1].data.push(humidityPoint)
    this.chart.update()
  }
}
