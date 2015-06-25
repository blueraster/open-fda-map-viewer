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
        <div className='app-body back-gray--dark'>
          <Map />
        </div>
      </div>
    )
  }
}
