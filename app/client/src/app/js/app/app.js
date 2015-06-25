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
        <Map />
        <div className='app__panel absolute no-right padding back-white fill__long'>
          <div>Open FDA Enforcement MAPPER</div>
          <div>
            <select>
              <option>Joe's Sauce</option>
            </select>
            <div>total event count</div>
            <ul>
              <li>event 1</li>
              <li>event 2</li>
              <li>event 3</li>
              <li>event 4</li>
            </ul>
            <div>Event Details</div>
            <div>
              <ul>
                <li>attribute</li>
                <li>attribute</li>
                <li>attribute</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
