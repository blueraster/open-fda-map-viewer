import {store} from 'map/store'
import {app as appConfig} from 'js/config'
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
          attributes = feature.attributes,
          recallDeatils = [for (label of appConfig.detailLabels) if (attributes[label.key] !== undefined) <div>{`${label.text}: ${attributes[label.key]}`}</div>]
      console.debug(feature.attributes)
      return ([
        'Firms:',
        recallingFirms.map((firmName) => <div><button>{firmName}</button></div>),
        'Recall details:',
        <div className='back-white border-black'>{recallDeatils}</div>
      ])
    }()
    return (
      <div>
        <div onClick={() => {console.debug("hey")}}>{ui}</div>
      </div>
    )
  }
}
