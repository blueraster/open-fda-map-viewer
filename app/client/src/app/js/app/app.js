import {messages} from 'js/messages'
import {resources} from 'js/resources'
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
          <img className="image" src={resources.headerImage} />
          <h4>{messages.header}</h4>
          <div className='padding--small__bottom'>{messages.subheader}</div>
        </header>
        <div className='app-body back-gray--dark'>
          <Map />
        </div>
      </div>
    )
  }
}
