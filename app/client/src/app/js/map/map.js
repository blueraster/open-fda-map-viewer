import {map as config} from 'js/config'
import {actions} from 'map/actions'
import {actions as appActions} from 'app/actions'
import {Controls} from 'map/controls'
import {store} from 'map/store'
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
          Legend (WIP - click toggles visibility)
          <div>(symbol) All Clusters</div>
          <div>(symbol) Firm Clusters</div>
          <div>(symbol) Distribution Pattern</div>
        </div>
      </div>
    )
  }
}
