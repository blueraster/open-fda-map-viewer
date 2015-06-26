import {dispatcher} from 'js/dispatcher'
import {actions} from 'app/actions'
import {fetchFoodData} from 'app/fetcher'

export const store = dispatcher.createStore(class {
  constructor () {
    this.bindListeners({
      queryFda: actions.QUERY_FDA
    })
  }
  queryFda (food) {
    fetchFoodData(food)
      .then(actions.queryFdaSuccess)
      // TODO: .catch(actions.queryFdaFailure)
  }
})
