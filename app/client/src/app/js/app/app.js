import {messages} from 'js/messages'
import {resources} from 'js/resources'
import {actions} from 'app/actions'
import {Map} from 'map/map'
import {Panel} from 'panel/panel'
// lib/vendor/esri/dojo
import React from 'react'

actions.init()
//<Map />
//<Panel />
export class App extends React.Component {
  render () {
    return (
      <div className='app'>

        <div className="app__content">
          <Map />
        </div>

        <div className="app__panel">
          <Panel />
        </div>
      </div>
    )
  }
}
