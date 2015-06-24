// src
import {dispatcher} from 'js/dispatcher'

export const actions = dispatcher.createActions(class {
  mapInit () {
    this.dispatch()
  }
  queryFda (term) {
    this.dispatch(term)
  }
})
