import {messages} from 'js/messages'
import {resources} from 'js/resources'
import {actions} from 'panel/actions'
import {actions as appActions} from 'app/actions'
import {store} from 'panel/store'
import {panel as config} from 'js/config'
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
    let foodControl = (food) => <button onClick={() => {appActions.queryFda(food)}}>{food}</button>,
        foodGroupControl = (group, foods) => (
          <div className='inline-block'>
            <button>{group[0].toUpperCase() + group.substr(1)}</button>
            <select>
              {[for (food of foods) <option>{food}</option>]}
            </select>
          </div>
        ),
        foodControls,
        currentRecalls

    foodControls = [for (food of Object.keys(config.foods.individual)) foodControl(config.foods.individual[food])]
    foodControls = foodControls.concat([for (group of Object.keys(config.foods.nested)) foodGroupControl(group, [for (food of config.foods.nested[group]) food])])
    let firmUI = this.state.firmData === undefined ? undefined : () => {
      let currentAllRecalls = this.state.firmData[this.state.currentFirm.toString()].allRecalls

      let firmOptions = this.state.firmData === undefined ? undefined : (
        // ({this.state.firmData[d].uniqueEventIds.length})
        [for (d of Object.keys(this.state.firmData)) <option value={d}>{`${d} (${this.state.firmData[d].uniqueEventIds.length})`}</option>]
      )

      let firmEvents = this.state.currentFirm === undefined ? undefined :(
        [for(r of this.state.firmData[this.state.currentFirm].uniqueEventIds) <option value={r}>{r}</option>]
      )
      let eventRecalls = this.state.currentSelectedFirmEvent ==undefined ? undefined: () =>{
        currentRecalls = Array.from(new Set([for (r of currentAllRecalls) if (r.event_id === this.state.currentSelectedFirmEvent) r ]))
        let options = Array.from(new Set([for (r of currentAllRecalls) if (r.event_id === this.state.currentSelectedFirmEvent) <option value={r.recall_number}>{r.recall_number}</option>]))
        return ({options})
      }()

      let recallDetails = this.state.currentSelectedRecall ==undefined ? undefined: () =>{
        let recallForEvent = Array.from(new Set([for (r of currentAllRecalls) if (r.event_id === this.state.currentSelectedFirmEvent) r]))
        let selectedRecall = [for( i of recallForEvent) if(i.recall_number === this.state.currentSelectedRecall) i][0]
        // let recallDeatils = [for (label of appConfig.detailLabels) if (selectedRecall[label.key] !== undefined) <div>{`${label.text}: ${selectedRecall[label.key]}`}</div>]
        let recallDeatils = [for (label of appConfig.detailLabels) <li>{`${label.text}: ${selectedRecall[label.key]}`}</li>]
        return recallDeatils
      }()

      //TODO
      // Add recall counts hide singler recall counts
      // Refactor select updates to single action
      return (
        <div>
          <label className='inline-block fill--50p__wide'>Business ({Object.keys(this.state.firmData).length})</label>
          <select className='fill--50p__wide' value={this.state.currentFirm} onChange={(event) => {actions.setCurrentFirm(event.target.value)}}>
            {firmOptions}
          </select>
          <div className='inline-block fill--50p__wide'>Listed recall events</div>
          <select className="inline-block fill--50p__wide" value={this.state.currentSelectedFirmEvent} onChange={(event) =>{actions.setCurrentEvent(event.target.value)}}>
            {firmEvents}
          </select>
          <div className='inline-block fill--50p__wide'>Event Recalls</div>
          <select className="inline-block fill--50p__wide" value={this.state.currentSelectedRecall} onChange={(event) =>{actions.setCurrentRecall(event.target.value)}} >
            {eventRecalls}
          </select>
          <div>Details</div>
          <ul>
            {recallDetails}
          </ul>
          <button>Visualize firm recalls (toggle)</button>
          <button>View distribution pattern</button>
        </div>
      )
    }()

    return (
        <div className='padding back-white'>
          <div>{foodControls}</div>
          {firmUI}
        </div>
    )
  }
}
