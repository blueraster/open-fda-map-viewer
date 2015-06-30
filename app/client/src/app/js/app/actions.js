import {dispatcher} from 'js/dispatcher'
import {app as config} from 'js/config'
import {messages} from 'js/messages'
import {geocode} from 'util/shame'
// Lib Vendor
import React from 'react'
import boron from 'boron'

export const actions = dispatcher.createActions(class {
  init () {
    document.title = messages.title
    document.body.className = config.dojoTheme
    this.dispatch()
  }

  setChartContext (context) {
    this.dispatch(context)
  }

  queryFda (food) {
    this.dispatch(food)
  }

  queryFdaSuccess (foodData, food) {
    // TODO: remove
    //geocode(foodData, food)
    this.dispatch(foodData)
  }

  queryFdaTimeseriesSuccess (timeseries) {
    this.dispatch(timeseries)
  }
})
