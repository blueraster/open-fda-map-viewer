import {dispatcher} from 'js/dispatcher'
import {actions} from 'map/actions'
import {actions as appActions} from 'app/actions'
import {map as config} from 'js/config'
// lib/vendor/esri/dojo
import esriMap from 'esri/map'

export const store = dispatcher.createStore(class {
  constructor () {
    this.map = undefined
    this.bindListeners({
      mapInit: actions.MAP_INIT
    })
  }
  mapInit () {
    this.map = new esriMap(config.id, config.options)
  }
}, 'mapStore')
