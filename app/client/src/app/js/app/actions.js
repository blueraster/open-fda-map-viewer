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
        title:`
          <h2>${messages.title}</h2>
          <p>${messages.header}</p>
          <p>${messages.subheader}</p>
        `,
        text: 'A custom <span style="color:#F8BB86">html<span> message.',
        html: true
      });

    this.dispatch()

  }
})
