import {map as config} from 'js/config'
import {actions} from 'map/actions'
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
    actions.mapInit()
  }
  componentWillUnmount () {
    store.unlisten(this.onChange)
  }
  onChange (state) {
    this.setState(state)
  }
  render () {
    let map = this.state.map,
        controls = map === undefined ? undefined : <Controls {...this.state} />,
        infoWindow = map === undefined ? undefined : map.infoWindow.isShowing === false ? undefined : <InfoWindow {...this.state}/>
    return (
      <div className='map-container absolute fill'>
        <div className='absolute margin padding--small z-index-map back-white'>
          <div className='padding--small__bottom'>
            <button className='margin__right'>Bacteria</button>
            <select>
              <option>Chloramphenicol</option>
              <option>Salmonella</option>
              <option>Listeria</option>
            </select>
          </div>
          <div className='padding--small__bottom'><button onClick={() => {actions.queryFda(config.queryTerms.iceCream)}}>{config.queryTerms.iceCream}</button></div>
          <div className='padding--small__bottom'><button>Wheat</button></div>
          <div className='padding--small__bottom'><button>Peanuts</button></div>
          <div className='padding--small__bottom'><button>Salads</button></div>
        </div>

        <div id={config.id} className='fill'></div>
        {controls}
      </div>
    )
  }
}
