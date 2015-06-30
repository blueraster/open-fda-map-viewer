// TODO: massive refactoring of customFeatureLayer into own component, kick off on store map item definition/initialization
import {dispatcher} from 'js/dispatcher'
import {actions} from 'map/actions'
import {actions as appActions} from 'app/actions'
import {actions as panelActions} from 'panel/actions'
import {map as config} from 'js/config'
import {store as panelStore} from 'panel/store'
import {InfoWindowContent} from 'map/infoWindowContent'
// lib/vendor/esri/dojo
import React from 'react'
import ClusterFeatureLayer from 'ClusterFeatureLayer'
import esriMap from 'esri/map'
import FeatureLayer from 'esri/layers/FeatureLayer'
import SimpleMarkerSymbol from 'esri/symbols/SimpleMarkerSymbol'
import SimpleLineSymbol from 'esri/symbols/SimpleLineSymbol'
import SimpleFillSymbol from 'esri/symbols/SimpleFillSymbol'
import SimpleRenderer from 'esri/renderers/SimpleRenderer'
import ClassBreaksRenderer from 'esri/renderers/ClassBreaksRenderer'
import Graphic from 'esri/graphic'
import Point from 'esri/geometry/Point'
import Color from 'dojo/_base/Color'
import on from 'dojo/on'

export const store = dispatcher.createStore(class {
  constructor () {
    this.map = undefined
    this.selectedFirmNameForClusters = undefined
    this.selectedFirmNameForInfoWindowContent = undefined
    // TODO: refactor ridiculously long listeners & dependencie into own components
    this.bindListeners({
      initMap: actions.INIT_MAP,
      setSelectedBacteria: actions.SET_SELECTED_BACTERIA,
      setSelectedFirmNameForClusters: actions.SET_SELECTED_FIRM_NAME_FOR_CLUSTERS,
      setSelectedFirmNameForInfoWindowContent: actions.SET_SELECTED_FIRM_NAME_FOR_INFO_WINDOW_CONTENT,
      handleSetCurrentRecallStateMatches: [panelActions.SET_CURRENT_FIRM, panelActions.SET_CURRENT_EVENT, panelActions.SET_CURRENT_RECALL],
      handleQueryFdaSuccess: appActions.QUERY_FDA_SUCCESS
    })
  }
  initMap () {
    let map = new esriMap(config.id, config.options)
    let renderer,
    defaultSym,
    small,
    medium,
    large,
    xlarge;
    on.once(map, 'extent-change', (event) => {
      let statesLayer = new FeatureLayer('http://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_States_Generalized/FeatureServer/0', {
        id: 'states',
        // mode: FeatureLayer.MODE_SNAPSHOT,
        // showLabels: true,
        visible: false
      })
      statesLayer.setRenderer(new SimpleRenderer(new SimpleFillSymbol(config.symbology.states)))
      map.addLayer(statesLayer)

      map.on('click', (event) => {
        if (event.graphic === undefined) {
          map.infoWindow.hide()
          // TODO: clear state highlights
        }
      })
    defaultSym = new SimpleMarkerSymbol("circle", 16,
              new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([102,0,0, .55]), 3),
              new Color([255, 255, 255, 1]));

      let clustersLayer = new ClusterFeatureLayer({
          id: 'clusters',
          url: 'http://services.arcgis.com/oKgs2tbjK6zwTdvi/arcgis/rest/services/Major_World_Cities/FeatureServer/0',
          // 'distance': 75,
          distance: 0,
          labelColor: '#fff',
          resolution: map.extent.getWidth() / map.width,
          // 'singleTemplate': infoTemplate,
          useDefaultSymbol: false,
          zoomOnClick: false,
          showSingles: true,
          objectIdField: 'FID',
          // outFields: ['NAME', 'COUNTRY', 'POPULATION', 'CAPITAL']
          opacity: 0,
          outFields: []
      });

      let firmClusterLayer = new ClusterFeatureLayer({
          id: 'firmClusters',
          url: 'http://services.arcgis.com/oKgs2tbjK6zwTdvi/arcgis/rest/services/Major_World_Cities/FeatureServer/0',
          // 'distance': 75,
          distance: 0,
          labelColor: '#fff',
          resolution: map.extent.getWidth() / map.width,
          // 'singleTemplate': infoTemplate,
          useDefaultSymbol: false,
          zoomOnClick: false,
          showSingles: true,
          singleSymbol: new SimpleMarkerSymbol(config.symbology.firmClustersSingle),
          objectIdField: 'FID',
          // outFields: ['NAME', 'COUNTRY', 'POPULATION', 'CAPITAL']
          opacity: 0,
          outFields: []
      });

      firmClusterLayer.setRenderer(new ClassBreaksRenderer(config.symbology.firmClustersRenderer))

      map.addLayer(clustersLayer)
      map.addLayer(firmClusterLayer)
      map.on('extent-change', (event) => {
        clustersLayer._reCluster()
        firmClusterLayer._reCluster()
      })

      let infoWindow = map.infoWindow,
          mount

      mount = document.createElement('div')
      mount.innerHTML = 'mountPoint'
      mount.className = 'padding back-white'
      map.infoWindow._contentPane.parentElement.appendChild(mount)
      React.render(<InfoWindowContent />, mount)
    })
    window.map = map
    this.map = map
  }
  setSelectedBacteria (Bacteria) {
    this.selectedBacteria = Bacteria
  }
  setSelectedFirmNameForInfoWindowContent (firmName) {
    this.selectedFirmNameForInfoWindowContent = firmName
  }
  handleSetCurrentRecallStateMatches () {
    this.waitFor(panelStore.dispatchToken)
    this.setSelectedFirmNameForClusters(panelStore.getState().currentFirm)
    this.setDistributionPatternMatches(panelStore.getState().currentSelectedRecallStateMatches)
  }
  setDistributionPatternMatches (stateMatches) {
    let statesLayer = this.map.getLayer('states'),
        clause
    if (stateMatches.stateCodes.length > 0) {
      clause = `STATE_ABBR IN (${stateMatches.stateCodes.map((c) => `'${c}'`)})`
    } else if (stateMatches.stateNames.length > 0 ) {
      clause = `STATE_NAME IN (${stateMatches.stateNames.map((n) => `'${n}'`)})`
    }
    if (clause !== undefined) {
      statesLayer.setDefinitionExpression(clause)
      statesLayer.setVisibility(true)
    } else {
      statesLayer.setVisibility(false)
    }
  }
  setSelectedFirmNameForClusters (firmName) {
    let alldata = this.map.getLayer('clusters')._clusterData
    let matchedData = [for(d of alldata) if (d.attributes.recalling_firm === firmName) d]
    let clustersLayer = this.map.getLayer('firmClusters')
    clustersLayer._clusterData = matchedData
    clustersLayer._reCluster()
    clustersLayer.setOpacity(1)
  }
  handleQueryFdaSuccess (foodData) {
    this.waitFor(panelStore.dispatchToken)
    this.setDistributionPatternMatches(panelStore.getState().currentSelectedRecallStateMatches)
    let map = this.map,
        clustersLayer = map.getLayer('clusters'),
        firmClusterLayer = map.getLayer('firmClusters'),
        clusterData = [],
        matchedCityFoodData,
        matchedStateFoodData,
        unmatchedCityFoodData,
        unmatchedStateFoodData

    // TODO: This needed erorr catching, when node server is off app fails, should fall out clean
    fetch(config.requests.geoData())
      .then((response) => response.json())
      .then((json) => {
        unmatchedStateFoodData = [for (d of foodData) if (json[d.state] === undefined) d]
        matchedStateFoodData = [for (d of foodData) if (json[d.state] !== undefined) d]
        unmatchedCityFoodData = [for (d of matchedStateFoodData) if (json[d.state][d.city] === undefined) d]
        matchedCityFoodData = [for (d of matchedStateFoodData) if (json[d.state][d.city] !== undefined) d]

        for (let key in matchedCityFoodData) {
          let data = matchedCityFoodData[key],
              graphic = new Graphic(clustersLayer._clusterData[0].toJson()),
              geometry = new Point(graphic.geometry.toJson()),
              cityGeometry = json[data.state][data.city]

          geometry = geometry.setX(cityGeometry.x)
          geometry = geometry.setY(cityGeometry.y)
          graphic = graphic.setGeometry(geometry)
          graphic = graphic.setAttributes(data)
          clusterData.push(graphic)
        }
        clustersLayer._clusterData = clusterData
        clustersLayer._reCluster()
        clustersLayer.setOpacity(1)

        let uniqueFirmNames = Array.from(new Set([for (r of foodData) r.recalling_firm]));
        this.setSelectedFirmNameForClusters(uniqueFirmNames[0])
        // debugger;
      })
  }
}, 'mapStore')





