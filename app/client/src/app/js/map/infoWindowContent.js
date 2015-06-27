import {store} from 'map/store'
// lib/vendor/shim/esri/dojo
import React from 'react'

export class InfoWindowContent extends React.Component {
  constructor (props) {
    super(props)
    this.state = store.getState()
  }
  render () {
    let infoWindow = this.state.map.infoWindow,
        features = infoWindow.features,
        ui
    ui = infoWindow.features === null ? undefined : () => {
      let recallingFirms = Array.from(new Set([for (f of infoWindow.features) f.attributes.recalling_firm]))
      return ([
        'Firms:',
        recallingFirms.map((firmName) => <div>{firmName}</div>)
      ])
    }()
    return (
      <div>
        {new Date().toISOString()}
        <div>{ui}</div>
      </div>
    )
  }
}
