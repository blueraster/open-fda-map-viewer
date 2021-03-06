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
        let recallDetails = [for (key of rows) <li className='padding__bottom'><span className='text-blue'>{appConfig.detailLabelsUnordered[key]}: </span>{selectedRecall[key]}</li>]
        let date = [selectedRecall['report_date'].substr(4,2), selectedRecall['report_date'].substr(2,2), selectedRecall['report_date'].substr(0,4)].join('/')
        let location = `${selectedRecall['city']}, ${selectedRecall['state']}`

        return (
          <div>
            <div className='margin__bottom'>
              <h4 className='inline-block vertical-bottom no-margin padding--small__right'></h4><h2 className='inline-block vertical-bottom no-margin'>{selectedRecall['recalling_firm']}</h2>
            </div>
            <div className='panel__details'>
              <div className='margin__bottom border-white__bottom'>Recall Specifics:</div>
              <div className='inline-block padding__bottom fill--50p__wide vertical-top'>
                <div><span className='text-blue'>Date: </span>{date}</div>
              </div>
              <div className='inline-block padding__bottom fill--50p__wide text-right'>
                <div><span className='text-blue'>Status: </span>{selectedRecall['status']}</div>
                <div><span className='text-blue'>Location: </span>{location}</div>
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
            <div className='inline-block fill--50p__wide'>Events ({recallEventsLength})</div>
            <select className="text-black inline-block fill--50p__wide" value={this.state.currentSelectedFirmEvent} onChange={(event) =>{actions.setCurrentEvent(event.target.value)}}>
              {firmEvents}
            </select>
            <div className='inline-block fill--50p__wide'>Recall ({recallsLength})</div>
            <select className="text-black inline-block fill--50p__wide" value={this.state.currentSelectedRecall} onChange={(event) =>{actions.setCurrentRecall(event.target.value)}}>
              {eventRecalls}
            </select>
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
