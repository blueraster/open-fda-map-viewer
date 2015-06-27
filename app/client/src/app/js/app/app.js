import {messages} from 'js/messages'
import {resources} from 'js/resources'
import {actions} from 'app/actions'
import {store} from 'app/store'
import {Map} from 'map/map'
import {Panel} from 'panel/panel'
import {Chart} from 'app/chart'
// lib/vendor/esri/dojo
import React from 'react'

actions.init()

export class App extends React.Component {
  render () {
    return (
      <div className='app back-gray--dark'>
        <div className="app__content back-gray--dark">
          <Map />
          <Chart />
        </div>
        <div className="app__panel">
          <Panel />
        </div>
      </div>
    )
  }
}
