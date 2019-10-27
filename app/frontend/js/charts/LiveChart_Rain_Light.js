class LiveChart_Rain_Light extends LiveChart {
  constructor(liveChartID, xvals, yvals1, yvals2) {
    super(liveChartID, yvals1, yvals2)
    this.__config = deepmerge(super.__baseConfig(), this.__init_config(xvals, yvals1, yvals2));
  }

  __init_config(xvals, yvals1, yvals2) {
    return {
      type: 'bar',
      data: {
        labels: xvals,
        datasets: [{
          yAxisID: 'Rain',
          label: 'Rain',
          data: yvals1,
          backgroundColor: 'rgba(30, 144, 255, 0.3)',
          borderColor: '#1e90ff',
          pointBackgroundColor: '#d1ccc0',
          order: 1
        },
        {
          type: 'line',
          yAxisID: 'Light',
          label: 'Light',
          data: yvals2,
          backgroundColor: 'rgba(255, 242, 0, 0.1)',
          borderColor: '#fff200',
          pointBackgroundColor: '#d1ccc0'
        }]
      },
      options: {
        scales: {
          yAxes: [{
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
              max:10,
              fontColor: 'rgba(255, 255, 255, 0.7)',
              callback: (value) => super.labelRain(value),
            },
            gridLines: {
              color: 'rgba(255, 255, 255, 0.25)',
              lineWidth: 0.75
            },
            position: 'left'
          },
          {
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
    super.unzoom(0, 10, true, 0, 1000);
  }
}
