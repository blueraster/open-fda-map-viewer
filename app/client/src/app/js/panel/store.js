import {dispatcher} from 'js/dispatcher'
import {actions} from 'panel/actions'
import {map as config} from 'js/config'

export const store = dispatcher.createStore(class {
  constructor () {
    this.bindListeners({
       panelInit: actions.PANEL_INIT,
      // queryFda: actions.QUERY_FDA,
      // createClusterLayer: actions.CREATE_CLUSTER_LAYER
    })
  }
  panelInit () {

  }
}, 'panelStore')
