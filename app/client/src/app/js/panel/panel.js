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
    let firmUi

    if (this.state.firmData === undefined) {
      let firmOptions = this.state.firmData === undefined ? undefined : (
        [for (d of Object.keys(this.state.firmData)) <option  value={d}>{d}</option>]
      )

      let firmRecalls = this.state.currentFirm ===undefined ? undefined :(
        [for(r of this.state.firmData[this.state.currentFirm].allRecalls ) <li>{r.product_description}</li>]
      )
      let firmUI = (
        <div>
          <label>Unique Firms ({this.state.firmDataLength})</label>
          <select className='fill__wide' value={this.state.currentFirm} onChange={(event) => {actions.setCurrentFirm(event.target.value)}}>
            {firmOptions}
          </select>
          <div>All Recalls</div>
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

    } else {
      let firmUI = undefined
    }



    return (
        <div className='padding'>
          <div>Open FDA Enforcement MAPPER</div>
        </div>
    )
  }
}
