import {map as config} from 'js/config'
import {actions} from 'map/actions'
import {actions as appActions} from 'app/actions'
import {Controls} from 'map/controls'
import {store} from 'map/store'
import {messages} from 'js/messages'
import {resources} from 'js/resources'
// lib/vendor/esri/dojo
import React from 'react'

export class Map extends React.Component {
  constructor (props) {
    super(props)
    this.state = store.getState()
  }
  componentDidMount () {
    store.listen(this.onChange.bind(this))
    actions.initMap()
  }
  componentWillUnmount () {
    store.unlisten(this.onChange)
  }
  onChange (state) {
    this.setState(state)
  }
  render () {
    let map = this.state.map,
        controls = map === undefined ? undefined : <Controls {...this.state} />

    return (
      <div className='map-container absolute fill'>
        <div id={config.id} className='fill'></div>
        {controls}
        <div className='absolute legend'>
          <div className='inline-block padding__wide padding--small__long margin--small__bottom' style={{backgroundColor: '#6091b2'}}><h3 className='no-margin'>{messages.title}</h3></div>
          <div className='margin__wide margin--small__bottom'>
            <div className='legend__symbol'><img className='fill' src={resources.legendSymbols.allRecalls} /></div>
            <span className='vertical-middle'>Recalls</span>
          </div>
          <div className='margin__wide margin--small__bottom'>
            <div className='legend__symbol'><img className='fill' src={resources.legendSymbols.firmRecalls} /></div>
            <span className='vertical-middle'>Selected Firm</span>
          </div>
          <div className='margin__wide margin__bottom'>
            <div className='legend__symbol'><img className='fill' src={resources.legendSymbols.distributionPatterns} /></div>
            <span className='vertical-middle'>Affected States</span>
          </div>
        </div>
      </div>
    )
  }
}
