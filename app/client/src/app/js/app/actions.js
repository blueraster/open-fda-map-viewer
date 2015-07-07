import {dispatcher} from 'js/dispatcher'
import {app as config} from 'js/config'
import {messages} from 'js/messages'
import {geocode} from 'util/shame'
// Lib Vendor
import React from 'react'

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
    let closeIcon = document.getElementsByClassName('popup')
    closeIcon[0].classList.add('hidden')
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
