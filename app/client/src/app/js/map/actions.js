// src
import {dispatcher} from 'js/dispatcher'

export const actions = dispatcher.createActions(class {
  initMap () {
    this.dispatch()
  }
  setSelectedBacteria (bacteria) {
    this.dispatch(bacteria)
  }
  setFocusedFirmName (firmName) {
    this.dispatch(firmName)
  }
})
