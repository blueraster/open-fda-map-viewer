import {messages} from 'js/messages'
import {resources} from 'js/resources'
import {actions} from 'panel/actions'
import {actions as appActions} from 'app/actions'
import {store} from 'panel/store'
import {panel as config} from 'js/config'

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
      let firmOptions = this.state.firmData === undefined ? undefined : (
        // ({this.state.firmData[d].uniqueEventIds.length})
        [for (d of Object.keys(this.state.firmData)) <option value={d}>{`${d} (${this.state.firmData[d].uniqueEventIds.length})`}</option>]
      )

      let firmEvents = this.state.currentFirm === undefined ? undefined :(
        [for(r of this.state.firmData[this.state.currentFirm].uniqueEventIds) <option value={r}>{r}</option>]
      )
      let eventRecalls = this.state.currentSelectedFirmEvent ==undefined ? undefined: () =>{
        let currentAllRecalls = this.state.firmData[this.state.currentFirm.toString()].allRecalls
        currentRecalls = Array.from(new Set([for (r of currentAllRecalls) if (r.event_id === this.state.currentSelectedFirmEvent) r ]))
        let options = Array.from(new Set([for (r of currentAllRecalls) if (r.event_id === this.state.currentSelectedFirmEvent) <option value={r.recall_number}>{r.recall_number}</option>]))
        return ({options})
      }()

      let recallDetails = this.state.currentSelectedRecall ==undefined ? undefined: () =>{
        return this.state.currentSelectedRecall
      }()





      //TODO
      // Add recall counts hide singler recall counts
      return (
        <div>
          <label>Business ({Object.keys(this.state.firmData).length})</label>
          <select className='fill__wide' value={this.state.currentFirm} onChange={(event) => {actions.setCurrentFirm(event.target.value)}}>
            {firmOptions}
          </select>
          <div>Listed recall events</div>
          <select className="fill__wide">
            {firmEvents}
          </select>
          <div>Event Recalls</div>
          <select className="fill__wide">
            {eventRecalls}
          </select>

          <div>Details</div>
            {recallDetails}



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
