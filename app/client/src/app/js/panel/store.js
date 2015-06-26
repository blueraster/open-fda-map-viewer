import {dispatcher} from 'js/dispatcher'
import {actions} from 'map/actions'
import {actions as appActions} from 'app/actions'
import {map as config} from 'js/config'
import {getFoodData} from 'map/fetcher'
// lib/vendor/esri/dojo
export const store = dispatcher.createStore(class {
  constructor () {
    this.map = undefined
    this.bindListeners({
       panelInit: actions.PANEL_INIT,
      // queryFda: actions.QUERY_FDA,
      // createClusterLayer: actions.CREATE_CLUSTER_LAYER
    })
  }
}, 'panelStore')
