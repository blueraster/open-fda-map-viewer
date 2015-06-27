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
      let recallingFirms = Array.from(new Set([for (f of infoWindow.features) f.attributes.recalling_firm])),
          feature =  infoWindow.getSelectedFeature(),
          featureDetails = Object.keys(feature.attributes).map((key) => <div>{`${key}: ${feature.attributes[key]}`}</div>)

      console.debug(feature.attributes)

      return ([
        'Firms:',
        recallingFirms.map((firmName) => <div><button>{firmName}</button></div>),
        featureDetails
      ])
    }()
    return (
      <div>
        {new Date().toISOString()}
        <div onClick={() => {console.debug("hey")}}>{ui}</div>
      </div>
    )
  }
}
