class LiveChart_P_Rain extends LiveChart {
  constructor(liveChartID, xvals, yvals1, yvals2) {
    super(liveChartID, yvals1, yvals2);
    this.__config = deepmerge(super.__baseConfig(), this.__init_config(xvals, yvals1, yvals2));
  }

  __init_config(xvals, yvals1, yvals2) {
    return {
      type: 'bar',
      data: {
        labels: xvals,
        datasets: [{
          type: 'line',
          yAxisID: 'Pressure',
          label: 'Pressure',
          data: yvals1,
          backgroundColor: 'rgba(200, 214, 229, 0.1)',
          borderColor: '#c8d6e5',
          pointBackgroundColor: '#d1ccc0',
          order: 1
        },
        {
          yAxisID: 'Rain',
          label: 'Rain',
          data: yvals2,
          backgroundColor: 'rgba(30, 144, 255, 0.3)',
          borderColor: '#1e90ff',
          pointBackgroundColor: '#d1ccc0',
          order: 2
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
            },
            gridLines: {
              color: 'rgba(255, 255, 255, 0.25)',
              lineWidth: 0.75
            },
            position: 'left'
          },
          {
            id: 'Rain',
            scaleLabel: {
              display: true,
              labelString: 'Rain Intensity',
              lineHeight: 2,
              fontSize: 17,
              fontColor: 'rgba(255, 255, 255, 0.7)',
            },
            ticks: {
              min: 0, 
              max: 10,
              fontColor: 'rgba(255, 255, 255, 0.7)',
              callback: (value) => super.labelRain(value),
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
  
  addDataPoint(time, y1, y2) {
    super.addDataPoint(time, y1, super.rainToNumber(y2));
  }
  
  zoom() {
    super.zoom(true);
  }
  
  unzoom() {
    super.unzoom(90000, 110000, true, 0, 4);
  }
}
