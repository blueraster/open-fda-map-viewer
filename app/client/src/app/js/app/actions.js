import {dispatcher} from 'js/dispatcher'
import {app as config} from 'js/config'
import {messages} from 'js/messages'
import {Welcome} from 'app/welcome'
import {geocode} from 'util/shame'
// Lib Vendor
import React from 'react'
import sweetAlert from 'sweetalert'

export const actions = dispatcher.createActions(class {
  init () {
    document.title = messages.title
    document.body.className = config.dojoTheme

    swal({
      title: messages.title,
      text: React.renderToStaticMarkup(<Welcome />),
      allowEscapeKey: true,
      html: true
    });

    this.dispatch()
  }

  queryFda (food) {
    this.dispatch(food)
  }

  queryFdaSuccess (foodData, food) {
    // TODO: remove
    geocode(foodData, food)
    this.dispatch(foodData)
  }
})
