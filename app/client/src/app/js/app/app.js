import {messages} from 'js/messages'
import {actions} from 'app/actions'
import {Map} from 'map/map'
// lib/vendor/esri/dojo
import React from 'react'

actions.init()

export class App extends React.Component {
  render () {
    return (
      <div className='app'>
        <header className='padding--small'>
          <h4>{messages.header}</h4>
          <div className='padding--small__bottom'>{messages.subheader}</div>
        </header>
        <div className='app-body'>
          <Map />
        </div>
      </div>
    )
  }
}
