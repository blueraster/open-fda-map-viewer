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
        let rows = ['classification', 'reason_for_recall', 'distribution_pattern', 'product_description']
        let recallDetails = [for (key of rows) <li className='padding__bottom'><span className='text-gray--subtle'>{appConfig.detailLabelsUnordered[key]}: </span>{selectedRecall[key]}</li>]
        let date = [selectedRecall['report_date'].substr(4,2), selectedRecall['report_date'].substr(2,2), selectedRecall['report_date'].substr(0,4)].join('/')
        return (
          <div>
            <strong>Recall Specifics:</strong>
            <div className='panel__details'>
              <div className='inline-block padding__bottom fill--50p__wide'>
                <div>{date}</div>
                <div>{selectedRecall['status']}</div>
              </div>
              <div className='inline-block padding__bottom fill--50p__wide text-right'>
                <div>{selectedRecall['city']}</div>
                <div>{selectedRecall['state']}</div>
              </div>
              <ul>{recallDetails}</ul>
            </div>
          </div>
        )
      }()

      let recallEventsLength = this.state.firmData[this.state.currentFirm].uniqueEventIds.length

      // let recallEvents = recallEventsLength ===  1 ? <div
      // if (recallEventsLength === 1) {

      // }

      //TODO
      // Add recall counts hide singler recall counts
      // Refactor select updates to single action
      return (
        <div className='fill__long'>
          <div className='inline-block border-box padding__wide fill__long fill--25p__wide vertical-top'>
            <label className='inline-block fill--50p__wide'>Firms ({Object.keys(this.state.firmData).length})</label>
            <select className='text-black fill--50p__wide' value={this.state.currentFirm} onChange={(event) => {actions.setCurrentFirm(event.target.value);mapActions.setSelectedFirmNameForClusters(event.target.value)}}>
              {firmOptions}
            </select>
            <div className='text-gray--subtle margin__bottom'>Firm description</div>
            <div className='inline-block fill--50p__wide'>Event ({recallEventsLength})</div>
            <select className="text-black inline-block fill--50p__wide" value={this.state.currentSelectedFirmEvent} onChange={(event) =>{actions.setCurrentEvent(event.target.value)}}>
              {firmEvents}
            </select>
            <div className='text-gray--subtle margin__bottom'>Event description</div>
            <div className='inline-block fill--50p__wide'>Recall ({recallsLength})</div>
            <select className="text-black inline-block fill--50p__wide" value={this.state.currentSelectedRecall} onChange={(event) =>{actions.setCurrentRecall(event.target.value)}}>
              {eventRecalls}
            </select>
            <div className='text-gray--subtle margin__bottom'>Recall description</div>
          </div>

          <div className='inline-block border-box padding__wide fill__long fill--75p__wide vertical-top'>
            {recallDetails}
          </div>
        </div>
      )
    }()

    return (
        <div className='fill__long'>
          {firmUI}
        </div>
    )
  }
}
