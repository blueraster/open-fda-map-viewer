import {messages} from 'js/messages'
import {resources} from 'js/resources'
// lib/vendor/esri/dojo
import React from 'react'


export class Welcome extends React.Component {
  render () {
    return (
      <div>
        <p>{messages.text}</p>

      </div>
    )
  }
}
