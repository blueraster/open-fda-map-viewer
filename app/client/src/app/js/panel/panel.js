import {messages} from 'js/messages'
import {resources} from 'js/resources'
import {actions} from 'panel/actions'
import {store} from 'panel/store'
import {appStore} from 'app/store'

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
    let firmUI = this.state.firmData === undefined ? <div>nofirms</div> : () => {
      let firmOptions = this.state.firmData === undefined ? undefined : (
        [for (d of Object.keys(this.state.firmData)) <option  value={d}>{d}</option>]
      )

      let firmRecalls = this.state.currentFirm ===undefined ? undefined :(
        [for(r of this.state.firmData[this.state.currentFirm].uniqueEventIds) <li>{r}</li>]
      )
      return (
        <div>
          <label>Firms (total: {Object.keys(this.state.firmData).length}):</label>
          <select className='fill__wide' value={this.state.currentFirm} onChange={(event) => {actions.setCurrentFirm(event.target.value)}}>
            {firmOptions}
          </select>
          <div>Reported Recall Events </div>
          <ul>
            {firmRecalls}
          </ul>
          <div>Event Details</div>
          <div>
            <ul>
              <li>attribute</li>
            </ul>
          </div>
        </div>
      )
    }()

    return (
        <div className='padding back-white'>
          <div>Open FDA Enforcement MAPPER</div>
          {firmUI}
        </div>
    )
  }
}
