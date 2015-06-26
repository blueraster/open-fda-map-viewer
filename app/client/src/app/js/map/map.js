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
        infoWindow = map === undefined ? undefined : map.infoWindow.isShowing === false ? undefined : <InfoWindow {...this.state}/>,
        foodControls = []

    // individual foods
    for (let key in config.foods.individual) {
      let food = config.foods.individual[key]
      // foodControls.push(<div className='inline-block margin--small__wide'><button onClick={() => {actions.queryFda(food)}}>{food}</button></div>)
      foodControls.push(<div className='inline-block margin--small__wide'><button onClick={() => {appActions.queryFda(food)}}>{food}</button></div>)
    }

    // nested foods
    for (let groupKey in config.foods.nested) {
      let group = config.foods.nested[groupKey],
          groupName = groupKey[0].toUpperCase() + groupKey.substr(1),
          foods = group.map((food) => <option>{food}</option>)

      foodControls.push(
        <div className='inline-block margin--small__wide'>
          <button className='margin__right'>{groupName}</button>
          <select>{foods}</select>
        </div>
      )
    }


    return (
      <div className='map-container absolute fill'>
        <div className='absolute text-center no-left no-right margin z-index-map'>
          <div className='inline-block padding--small back-white'>
            {foodControls}
          </div>
        </div>
        <div id={config.id} className='fill'></div>
        {controls}
      </div>
    )
  }
}
