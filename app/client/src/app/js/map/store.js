import {dispatcher} from 'js/dispatcher'
import {actions} from 'map/actions'
import {actions as appActions} from 'app/actions'
import {map as config} from 'js/config'
import {recallsByTerm} from 'map/fetcher'
// lib/vendor/esri/dojo
import esriMap from 'esri/map'

export const store = dispatcher.createStore(class {
  constructor () {
    this.map = undefined
    this.bindListeners({
      mapInit: actions.MAP_INIT,
      queryFda: actions.QUERY_FDA
    })
  }
  mapInit () {
    this.map = new esriMap(config.id, config.options)
  }
  queryFda (food) {
    recallsByTerm(food)
      .then((results) => {console.debug(results)})
  }
}, 'mapStore')
