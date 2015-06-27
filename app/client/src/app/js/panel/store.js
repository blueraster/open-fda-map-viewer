import {dispatcher} from 'js/dispatcher'
import {actions} from 'panel/actions'
import {actions as appActions} from 'app/actions'
import {map as config} from 'js/config'

export const store = dispatcher.createStore(class {
  constructor () {
    this.firmData = undefined
    this.currentFirm = undefined
    this.currentSelectedFirmEvent = undefined
    this.currentSelectedRecall = undefined
    this.bindListeners({
      setCurentFirm:actions.SET_CURRENT_FIRM,
      handleQueryFdaSuccess: appActions.QUERY_FDA_SUCCESS,
      setCurrentEvent:actions.SET_CURRENT_EVENT,
      setCurrentRecall:actions.SET_CURRENT_RECALL
    })
  }
  setCurentFirm(firmName){
    this.currentFirm = firmName
    this.currentSelectedFirmEvent = this.firmData[this.currentFirm].uniqueEventIds[0]
    let allrecalls = this.firmData[this.currentFirm].allRecalls
    this.currentSelectedRecall = Array.from(new Set([for (r of allrecalls) if (r.event_id === this.currentSelectedFirmEvent) r.recall_number]))[0]

  }
  setCurrentEvent(eventID){
    console.debug(eventID)
    this.currentSelectedFirmEvent = eventID
    let allrecalls = this.firmData[this.currentFirm].allRecalls
    this.currentSelectedRecall = Array.from(new Set([for (r of allrecalls) if (r.event_id === this.currentSelectedFirmEvent) r.recall_number]))[0]
  }
  setCurrentRecall(recallID){
    this.currentSelectedRecall = recallID
  }
  handleQueryFdaSuccess (json) {
    // TODO: refactor panel processing
    let uniqueFirms = {},
        uniqueFirmNames,
        unique,
        getRecallsByFirm = (firm) => json.filter((r) => r.recalling_firm === firm)
    uniqueFirmNames = Array.from(new Set([for (r of json) r.recalling_firm]));
    ;[for (f of uniqueFirmNames) uniqueFirms[f] = {allRecalls: getRecallsByFirm(f), uniqueEventIds: []}]
    ;[for (f of uniqueFirmNames) uniqueFirms[f].uniqueEventIds = Array.from(new Set([for (r of uniqueFirms[f].allRecalls) r.event_id]))]
    let temp = uniqueFirms['Snoqualmlie Gourmet Ice Cream'],
        logField = (field) => [for (f of temp) console.debug(f.allRecalls)]
    this.firmData = uniqueFirms
    this.currentFirm = uniqueFirmNames[0]
    this.currentSelectedFirmEvent = uniqueFirms[uniqueFirmNames[0]].uniqueEventIds[0]
    let allrecalls = this.firmData[this.currentFirm].allRecalls
    this.currentSelectedRecall = Array.from(new Set([for (r of allrecalls) if (r.event_id === this.currentSelectedFirmEvent) r.recall_number]))[0]

  }
}, 'panelStore')
