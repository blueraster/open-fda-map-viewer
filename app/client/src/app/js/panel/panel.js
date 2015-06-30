import {messages} from 'js/messages'
import {resources} from 'js/resources'
import {actions} from 'panel/actions'
import {actions as mapActions} from 'map/actions'
import {store} from 'panel/store'
import {app as appConfig} from 'js/config'

// lib/vendor/esri/dojo
import React from 'react'

export class Panel extends React.Component {
  constructor (props) {
    super(props)
    this.state = store.getState()
  }
  componentDidMount () {
    store.listen(this.onChange.bind(this))
  }
  componentWillUnmount () {
    store.unlisten(this.onChange)
  }
  onChange (state) {
    this.setState(state)
  }
  render () {
    let currentRecalls,
        firmUI

    firmUI = this.state.firmData === undefined ? undefined : () => {
      let currentAllRecalls = this.state.firmData[this.state.currentFirm.toString()].allRecalls,
          firmData = this.state.firmData,
          recallsLength

      let firmOptions = firmData === undefined ? undefined : (
        // ({firmData[d].uniqueEventIds.length})
        // [for (d of Object.keys(firmData)) <option value={d}>{`${d} (${firmData[d].uniqueEventIds.length})`}</option>]
        [for (d of Object.keys(firmData)) <option value={d}>{`${d} ${firmData[d].uniqueEventIds.length < 2 ? '' : `(${firmData[d].uniqueEventIds.length})`}`}</option>]
      )

      let firmEvents = this.state.currentFirm === undefined ? undefined : (
        [for(r of this.state.firmData[this.state.currentFirm].uniqueEventIds) <option value={r}>{r}</option>]
      )

      let eventRecalls = this.state.currentSelectedFirmEvent ==undefined ? undefined: () =>{
        currentRecalls = Array.from(new Set([for (r of currentAllRecalls) if (r.event_id === this.state.currentSelectedFirmEvent) r ]))
        let options = Array.from(new Set([for (r of currentAllRecalls) if (r.event_id === this.state.currentSelectedFirmEvent) <option value={r.recall_number}>{r.recall_number}</option>]))
        recallsLength = options.length
        return ({options})
      }()

      let recallDetails = this.state.currentSelectedRecall == undefined ? undefined: () =>{
        let recallForEvent = Array.from(new Set([for (r of currentAllRecalls) if (r.event_id === this.state.currentSelectedFirmEvent) r]))
        let selectedRecall = [for (i of recallForEvent) if (i.recall_number === this.state.currentSelectedRecall) i][0]
        let recallDetails = [for (label of appConfig.detailLabels) <li>{`${label.text}: ${selectedRecall[label.key]}`}</li>]

        return (
          <div className='margin__top'>
            <strong>Details:</strong>
            <ul className='panel__details'>{recallDetails}</ul>
          </div>
        )
      }()

      let recallEventsLength = this.state.firmData[this.state.currentFirm].uniqueEventIds.length


      //TODO
      // Add recall counts hide singler recall counts
      // Refactor select updates to single action
      return (
        <div className='padding__wide'>
          <label className='inline-block fill--50p__wide'>Business ({Object.keys(this.state.firmData).length})</label>
          <select className='fill--50p__wide' value={this.state.currentFirm} onChange={(event) => {actions.setCurrentFirm(event.target.value);mapActions.setSelectedFirmNameForClusters(event.target.value)}}>
            {firmOptions}
          </select>
          <div className='inline-block fill--50p__wide'>Listed recall events ({recallEventsLength})</div>
          <select className="inline-block fill--50p__wide" value={this.state.currentSelectedFirmEvent} onChange={(event) =>{actions.setCurrentEvent(event.target.value)}} disabled={recallEventsLength === 1}>
            {firmEvents}
          </select>
          <div className='inline-block fill--50p__wide'>Event Recalls ({recallsLength})</div>
          <select className="inline-block fill--50p__wide" value={this.state.currentSelectedRecall} onChange={(event) =>{actions.setCurrentRecall(event.target.value)}} disabled={recallsLength === 1}>
            {eventRecalls}
          </select>
          {recallDetails}
        </div>
      )
    }()

    return (
        <div>
          {firmUI}
        </div>
    )
  }
}
