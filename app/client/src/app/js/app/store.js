import {dispatcher} from 'js/dispatcher'
import {actions} from 'app/actions'
import {fetchFoodData} from 'app/fetcher'

export const store = dispatcher.createStore(class {
  constructor () {
    this.foodToQuery = undefined
    this.bindListeners({
      queryFda: actions.QUERY_FDA
    })
  }
  queryFda (food) {
    this.foodToQuery = food
    fetchFoodData(food)
      .then((foodData, food) => actions.queryFdaSuccess(foodData, this.foodToQuery))
      // TODO: .catch(actions.queryFdaFailure)
  }
})
