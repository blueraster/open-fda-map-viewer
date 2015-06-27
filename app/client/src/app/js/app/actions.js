import {dispatcher} from 'js/dispatcher'
import {app as config} from 'js/config'
import {messages} from 'js/messages'
import {Welcome} from 'app/welcome'
// Lib Vendor
import React from 'react'
import sweetAlert from 'sweetalert'

export const actions = dispatcher.createActions(class {
  init () {
    document.title = messages.title
    document.body.className = config.dojoTheme

    // swal({
    //   title: messages.title,
    //   text: React.renderToStaticMarkup(<Welcome />),
    //   allowEscapeKey: false,
    //   showConfirmButton:false,
    //   html: true
    // })

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
