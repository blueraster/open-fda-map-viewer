import {messages} from 'js/messages'
import {resources} from 'js/resources'
import {actions} from 'app/actions'
import {store} from 'app/store'
import {Map} from 'map/map'
import {Panel} from 'panel/panel'
import {Chart} from 'app/chart'
import {Welcome} from 'app/welcome'
import {FoodControls} from 'app/foodControls'
// lib/vendor/esri/dojo
import React from 'react'

actions.init()

export class App extends React.Component {
  render () {
    return (
      <div className='app back-gray--dark'>
        <Welcome />
        <div className="app__content back-gray--dark">
          <Map />
        </div>
        <div className='app__panel-container absolute no-bottom no-left no-right margin-auto z-index-panel text-center text-black'>
          <div className='app__panel--dark inline-block back-white text-left'>
            <div className='app__panel__header text-center'><FoodControls /></div>
            <div className='app__panel__half inline-block'><Panel /></div>
            <div className='app__panel__half inline-block relative overflow-hidden'><Chart /></div>
          </div>
        </div>
      </div>
    )
  }
}
