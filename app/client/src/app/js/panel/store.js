import {dispatcher} from 'js/dispatcher'
import {actions} from 'panel/actions'
import {actions as appActions} from 'app/actions'
import {actions as mapActions} from 'map/actions'
import {map as mapConfig} from 'js/config'

export const store = dispatcher.createStore(class {
  constructor () {
    this.firmData = undefined
    this.currentFirm = undefined
    this.currentSelectedFirmEvent = undefined
    this.currentSelectedRecall = undefined
    this.currentSelectedRecallStateMatches = undefined
    this.bindListeners({
      setCurrentFirm:actions.SET_CURRENT_FIRM,
      handleQueryFdaSuccess: appActions.QUERY_FDA_SUCCESS,
      setCurrentEvent:actions.SET_CURRENT_EVENT,
      setCurrentRecall:actions.SET_CURRENT_RECALL
    })
  }
  setCurrentFirm(firmName){
    //TODO Add the Distribution action/update
    this.currentFirm = firmName
    this.currentSelectedFirmEvent = this.firmData[this.currentFirm].uniqueEventIds[0]
    let allrecalls = this.firmData[this.currentFirm].allRecalls
    let currentSelectedRecallData = Array.from(new Set([for (r of allrecalls) if (r.event_id === this.currentSelectedFirmEvent) r]))[0]
    this.currentSelectedRecall = currentSelectedRecallData.recall_number
    let stateCodes = currentSelectedRecallData.distribution_pattern.match(mapConfig.expressions.stateCodes) || [],
        stateNames = currentSelectedRecallData.distribution_pattern.match(mapConfig.expressions.stateNames) || [],
        stateMatches = {stateCodes, stateNames}
    this.currentSelectedRecallStateMatches = stateMatches
  }
  setCurrentEvent(eventID){
    this.currentSelectedFirmEvent = eventID
    let allrecalls = this.firmData[this.currentFirm].allRecalls,
        currentSelectedRecallData = Array.from(new Set([for (r of allrecalls) if (r.event_id === this.currentSelectedFirmEvent) r]))[0]
    this.currentSelectedRecall = currentSelectedRecallData.recall_number
    let stateCodes = currentSelectedRecallData.distribution_pattern.match(mapConfig.expressions.stateCodes) || [],
        stateNames = currentSelectedRecallData.distribution_pattern.match(mapConfig.expressions.stateNames) || [],
        stateMatches = {stateCodes, stateNames}
    this.currentSelectedRecallStateMatches = stateMatches
  }
  setCurrentRecall(recallID){
    this.currentSelectedRecall = recallID
    let recall = this.firmData[this.currentFirm].allRecalls.filter((r) => r.recall_number === recallID)[0],
        stateCodes = recall.distribution_pattern.match(mapConfig.expressions.stateCodes) || [],
        stateNames = recall.distribution_pattern.match(mapConfig.expressions.stateNames) || [],
        stateMatches = {stateCodes, stateNames}
    this.currentSelectedRecallStateMatches = stateMatches
    // TODO: fire recall update map action to update distribution layer
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
    this.firmData = uniqueFirms
    this.currentFirm = uniqueFirmNames[0]
    this.currentSelectedFirmEvent = uniqueFirms[uniqueFirmNames[0]].uniqueEventIds[0]
    let allrecalls = this.firmData[this.currentFirm].allRecalls
    let currentSelectedRecallData = Array.from(new Set([for (r of allrecalls) if (r.event_id === this.currentSelectedFirmEvent) r]))[0]
    this.currentSelectedRecall = currentSelectedRecallData.recall_number
    let stateCodes = currentSelectedRecallData.distribution_pattern.match(mapConfig.expressions.stateCodes) || [],
        stateNames = currentSelectedRecallData.distribution_pattern.match(mapConfig.expressions.stateNames) || [],
        stateMatches = {stateCodes, stateNames}
    this.currentSelectedRecallStateMatches = stateMatches
  }
}, 'panelStore')
