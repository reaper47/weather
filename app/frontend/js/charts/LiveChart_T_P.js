class LiveChart_T_P extends LiveChart {
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
          yAxisID: 'Temperature',
          label: 'Temperature',
          data: yvals1,
          borderColor: '#218c74',
          pointBackgroundColor: '#d1ccc0',
          order: 1
        },
        {
          yAxisID: 'Pressure',
          label: 'Pressure',
          data: yvals2,
          backgroundColor: 'rgba(200, 214, 229, 0.1)',
          borderColor: '#c8d6e5',
          pointBackgroundColor: '#d1ccc0',
          order: 2
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
            id: 'Pressure',
            scaleLabel: {
              display: true,
              labelString: 'Pressure (Pa)',
              lineHeight: 2,
              fontSize: 17,
              fontColor: 'rgba(255, 255, 255, 0.7)',
            },
            ticks: {
              suggestedMin: 90000, 
              suggestedMax: 110000,
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
    super.unzoom(0, 100, true, 90000, 110000);
  }
}