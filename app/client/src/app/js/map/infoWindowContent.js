import {store} from 'map/store'
import {map as config, app as appConfig} from 'js/config'
// lib/vendor/shim/esri/dojo
import React from 'react'
import graphicsUtils from 'esri/graphicsUtils'
import on from 'dojo/on'

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

      return ([
        'Firms:',
        recallingFirms.map((firmName) => <div><button onClick={this.focusFirm.bind(this)}>{firmName}</button></div>),
      ])
    }()
    return (
      <div>
        <div>{ui}</div>
      </div>
    )
  }
  focusFirm (event) {
    let map = this.state.map,
        infoWindow = map.infoWindow,
        features = infoWindow.features,
        feature = infoWindow.getSelectedFeature(),
        firmFeatures = [for (f of features) if (f.attributes.recalling_firm === event.target.innerText) f],
        recallsExtent = graphicsUtils.graphicsExtent(firmFeatures)

    // map.setExtent(recallsExtent)
    map.centerAndZoom(firmFeatures[0].geometry, config.options.maxZoom)
    infoWindow.setFeatures(firmFeatures)
    on.once(map, 'zoom-end', () => {infoWindow.reposition()})

    // debugger
    // console.debug(graphicsExtent(firmFeatures))
    // map.setExtent(graphicsUtils.graphicsExtent(firmFeatures), true)
    // filter features by firm event
    // get extent of all features
    // zoom to extent
    // infoWindow.hide()
    // set features
    // infoWindow.show()
    // debugger
  }
}
