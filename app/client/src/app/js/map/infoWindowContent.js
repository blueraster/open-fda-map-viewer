import {actions} from 'map/actions'
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
  componentDidMount () {
    store.listen(this.onChange.bind(this))
    let infoWindow = this.state.map.infoWindow,
        updated = false
    infoWindow.on('selection-change', () => {
      let feature = infoWindow.getSelectedFeature(),
          selectedFirmName = this.state.selectedFirmNameForInfoWindowContent

      // intelligently handle clicking a new cluster
      if (feature !== undefined && selectedFirmName !== undefined) {
        let firms = Array.from(new Set([for (f of infoWindow.features) f.attributes.recalling_firm]))
        if (firms.length > 1 || firms[0] !== selectedFirmName) {
          updated = true
          actions.setSelectedFirmNameForInfoWindowContent(undefined)
        }
      }

      if (!updated) {this.forceUpdate()}
      infoWindow.reposition()
    })
    infoWindow.on('hide', () => {
      actions.setSelectedFirmNameForInfoWindowContent(undefined)
    })
  }
  componentWillUnmount () {
    store.unlisten(this.onChange)
  }
  onChange (state) {
    this.setState(state)
  }
  render () {
    let selectedFirmName = this.state.selectedFirmNameForInfoWindowContent,
        infoWindow = this.state.map.infoWindow,
        features = infoWindow.features,
        ui

    ui = features === null || features === undefined ? undefined : () => {
      if (selectedFirmName !== undefined) {
        let feature = infoWindow.getSelectedFeature(),
            firmName = feature.attributes.recalling_firm,
            attributes = feature.attributes,
            recallDetails = [for (label of appConfig.detailLabels) if (attributes[label.key] !== undefined) <div>{`${label.text}: ${attributes[label.key]}`}</div>]
        // ENHANCEMENT: on back, return features to initally set features instead of hiding infowindow
        return [
          `Recalls for Firm: ${firmName}`,
          <div><button onClick={infoWindow.hide.bind(infoWindow)}>Back</button></div>,
          <hr />,
          recallDetails,
          <hr />,
          <button onClick={() => {this.showFirmClusters(firmName)}}>Visualize firm recalls (single click)</button>,
          <button onClick={() => {this.showDistributionPattern(firmName)}}>View distribution pattern</button>
        ]
      } else {
        let recallingFirms = Array.from(new Set([for (f of features) f.attributes.recalling_firm]))

        return ([
          'Firms:',
          recallingFirms.map((firmName) => <div><button onClick={this.focusFirm.bind(this)}>{firmName}</button></div>),
        ])
      }
    }()
    return (
      <div>
        <div>{ui}</div>
      </div>
    )
  }
  showFirmClusters (firmName) {
    // this.state.map.infoWindow.hide()
    actions.setSelectedFirmNameForClusters(firmName)
  }
  showDistributionPattern (firmName) {
    let feature = this.state.map.infoWindow.getSelectedFeature()

    console.debug('showDistributionPattern')
    console.debug(feature.attributes.distribution_pattern)
  }
  focusFirm (event) {
    let map = this.state.map,
        infoWindow = map.infoWindow,
        features = infoWindow.features,
        feature = infoWindow.getSelectedFeature(),
        firmFeatures = [for (f of features) if (f.attributes.recalling_firm === event.target.innerText) f]

    infoWindow.setFeatures(firmFeatures)
    actions.setSelectedFirmNameForInfoWindowContent(feature.attributes.recalling_firm)
    setTimeout(infoWindow.reposition.bind(infoWindow), 1)
  }
}
