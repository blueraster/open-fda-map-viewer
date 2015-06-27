import {dispatcher} from 'js/dispatcher'
import {actions} from 'app/actions'
import {fetchFoodData} from 'app/fetcher'
import {app as config} from 'js/config'
// lib/vendor/shim/esri/dojo
import Chartjs from 'Chartjs'

export const store = dispatcher.createStore(class {
  constructor () {
    this.foodToQuery = undefined
    this.timeseries = undefined
    this.chart = undefined
    this.bindListeners({
      initChart: actions.INIT_CHART,
      queryFda: actions.QUERY_FDA,
      queryFdaTimeseriesSuccess: actions.QUERY_FDA_TIMESERIES_SUCCESS,
    })
  }
  initChart (context) {
    this.chart = new Chartjs(context)
  }
  queryFda (food) {
    this.foodToQuery = food
    fetchFoodData(food)
      .then((foodData, food) => actions.queryFdaSuccess(foodData, this.foodToQuery))
    fetch(config.requests.ofdaTimeseries(food))
      .then((response) => response.json())
      .then((json) => actions.queryFdaTimeseriesSuccess(json.results))
      // TODO: .catch(actions.queryFdaFailure)
  }
  queryFdaTimeseriesSuccess (timeseries) {
    let months = ['01','02','03','04','05','06','07','08','09','10','11','12'],
        processedTimeseries = {},
        chartData = {}
    // init years
    ;[for (t of timeseries) processedTimeseries[t.time.substr(0,4)] = {}]
    // init empty months
    ;[for (y of Object.keys(processedTimeseries)) processedTimeseries[y] = months.map(() => 0)]
    // aggregate month counts
    ;[for (t of timeseries) processedTimeseries[t.time.substr(0,4)][months.indexOf(t.time.substr(4,2))] += t.count]
    // shape data for chart
    chartData = {
      labels: months,
      datasets: [for (t of Object.keys(processedTimeseries)) {
        label: t,
        fillColor: "rgba(151,187,205,0.2)",
        strokeColor: "rgba(151,187,205,1)",
        pointColor: "rgba(151,187,205,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(151,187,205,1)",
        data: processedTimeseries[t]
      }]
    }
    // console.debug(processedTimeseries)
    // console.debug(chartData)
    this.chart.Line(chartData, {})
    this.timeseries = timeseries
  }
})
