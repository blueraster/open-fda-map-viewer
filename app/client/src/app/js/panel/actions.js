// src
import {dispatcher} from 'js/dispatcher'

export const actions = dispatcher.createActions(class {
  panelInit () {
    //something
  }
  setCurrentFirm(firmName){
    this.dispatch(firmName)
  }
  setCurrentEvent(eventID){
    this.dispatch(eventID)
  }
})
