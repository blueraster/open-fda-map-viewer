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

    swal({
      title:messages.title,
      text:React.renderToStaticMarkup(<Welcome />),
      html: true
    });

    this.dispatch()
  }

  queryFda (food) {
    this.dispatch(food)
  }

  queryFdaSuccess (json) {
    this.dispatch(json)
  }
})
