import {dispatcher} from 'js/dispatcher'
import {actions} from 'app/actions'
import {fetchFoodData} from 'app/fetcher'
import {app as config} from 'js/config'
// lib/vendor/shim/esri/dojo
import moment from 'moment'

export const store = dispatcher.createStore(class {
  constructor () {
    this.foodToQuery = undefined
    this.timeseries = undefined
    this.bindListeners({
      queryFda: actions.QUERY_FDA,
      queryFdaTimeseriesSuccess: actions.QUERY_FDA_TIMESERIES_SUCCESS
    })
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
    this.timeseries = timeseries
  }
})
