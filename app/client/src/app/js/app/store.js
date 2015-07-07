import {dispatcher} from 'js/dispatcher'
import {actions} from 'app/actions'
import {fetchFoodData} from 'app/fetcher'
import {app as config} from 'js/config'
import {panel as panelConfig} from 'js/config'
// lib/vendor/shim/esri/dojo
import Chartjs from 'Chartjs'

export const store = dispatcher.createStore(class {
  constructor () {
    this.foodToQuery = undefined
    this.timeseries = undefined
    this.chart = undefined
    this.infoWindowContent = undefined
    this.chartContext = undefined
    this.bindListeners({
      setChartContext: actions.SET_CHART_CONTEXT,
      queryFda: actions.QUERY_FDA,
      queryFdaTimeseriesSuccess: actions.QUERY_FDA_TIMESERIES_SUCCESS
    })
  }
  setChartContext (context) {
    this.chartContext = context
  }
  queryFda (food) {
    this.foodToQuery = food

    fetchFoodData(food)
      .then((foodData, food) => actions.queryFdaSuccess(foodData, this.foodToQuery))

    let request = config.requests.ofdaTimeseries

    if (panelConfig.classifications.indexOf(food) > -1) {
      request = config.requests.ofdaTimeseriesByClassification
    }

    fetch(request(food))
      .then((response) => response.json())
      .then((json) => actions.queryFdaTimeseriesSuccess(json.results))
      // TODO: .catch(actions.queryFdaFailure)
  }
  queryFdaTimeseriesSuccess (timeseries) {
    let months = ['01','02','03','04','05','06','07','08','09','10','11','12'],
        monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
        processedTimeseries = {},
        chartData

    // init years
    ;[for (t of timeseries) processedTimeseries[t.time.substr(0,4)] = {}]
    // init empty months
    ;[for (y of Object.keys(processedTimeseries)) processedTimeseries[y] = months.map(() => 0)]
    // aggregate month counts
    ;[for (t of timeseries) processedTimeseries[t.time.substr(0,4)][months.indexOf(t.time.substr(4,2))] += t.count]
    // shape data for chart

    // REFERENCE: old multi-dataset
    // chartData = {
    //   labels: monthLabels,
    //   datasets: [for (t of Object.keys(processedTimeseries)) {
    //     label: t,
    //     fillColor: 'rgba(151,187,205,0.2)',
    //     strokeColor: 'rgba(151,187,205,1)',
    //     pointColor: 'rgba(151,187,205,1)',
    //     pointStrokeColor: '#fff',
    //     pointHighlightFill: '#fff',
    //     pointHighlightStroke: 'rgba(151,187,205,1)',
    //     data: processedTimeseries[t]
    //   }]
    // }

    let years = Object.keys(processedTimeseries),
        latestYear = years[years.length-1]

    if (years[years.length-1] === '2015') {
      latestYear = Math.max.apply(Math, years.slice(0, years.length-1).map((k) => parseInt(k))).toString()
    }

    if (this.chart === undefined) {
      // initialize
      chartData = {
        labels: monthLabels,
        datasets: [{
          label: latestYear,
          fillColor: 'rgba(151,187,205,0.2)',
          strokeColor: 'rgba(151,187,205,1)',
          pointColor: 'rgba(151,187,205,1)',
          pointStrokeColor: '#fff',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(151,187,205,1)',
          data: processedTimeseries[latestYear]
        }]
      }

      this.chart = new Chartjs(this.chartContext).Line(chartData, {
        scaleFontFamily: 'Raleway, sans-serif',
        scaleFontColor: '#FFF',
        scaleGridLineColor: 'rgba(255,255,255,.25)',
        tooltipFontColor: '#FFF'
      })
    } else {
      // update
      processedTimeseries[latestYear].forEach((p, i) => {this.chart.datasets[0].points[i].value = p})
      this.chart.update()
    }

    this.timeseries = timeseries
    this.timeseriesYear = latestYear
  }
})
