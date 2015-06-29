// TODO: massive refactoring of customFeatureLayer into own component, kick off on store map item definition/initialization
import {dispatcher} from 'js/dispatcher'
import {actions} from 'map/actions'
import {actions as appActions} from 'app/actions'
import {actions as panelActions} from 'panel/actions'
import {map as config} from 'js/config'
import {InfoWindowContent} from 'map/infoWindowContent'
// lib/vendor/esri/dojo
import React from 'react'
import ClusterFeatureLayer from 'ClusterFeatureLayer'
import esriMap from 'esri/map'
import FeatureLayer from 'esri/layers/FeatureLayer'
import Graphic from 'esri/graphic'
import Point from 'esri/geometry/Point'
import on from 'dojo/on'

export const store = dispatcher.createStore(class {
  constructor () {
    this.map = undefined
    // this.selectedFood = undefined
    // this.selectedBacteria = config.foods.nested.bacteria[0]
    this.bindListeners({
      mapInit: actions.MAP_INIT,
      setSelectedBacteria: actions.SET_SELECTED_BACTERIA,
      handleQueryFdaSuccess: appActions.QUERY_FDA_SUCCESS,
      handleSetCurentFirm: panelActions.SET_CURRENT_FIRM
    })
  }
  mapInit () {
    let map = new esriMap(config.id, config.options)
    on.once(map, 'extent-change', (event) => {
      let statesLayer = new FeatureLayer('http://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_States_Generalized/FeatureServer/0', {
        'id': 'states',
        'visible': false
      })
      map.addLayer(statesLayer)

      map.on('click', (event) => {
        if (event.graphic === undefined) {
          map.infoWindow.hide()
          // TODO: clear state highlights
        }
      })

      let clustersLayer = new ClusterFeatureLayer({
          'id': 'clusters',
          'url': 'http://services.arcgis.com/oKgs2tbjK6zwTdvi/arcgis/rest/services/Major_World_Cities/FeatureServer/0',
          // 'distance': 75,
          'distance': 0,
          'labelColor': '#fff',
          'resolution': map.extent.getWidth() / map.width,
          // 'singleTemplate': infoTemplate,
          'useDefaultSymbol': false,
          'zoomOnClick': false,
          'showSingles': true,
          'objectIdField': 'FID',
          // outFields: ['NAME', 'COUNTRY', 'POPULATION', 'CAPITAL']
          opacity: 0,
          outFields: []
      });

      let firmClusterLayer = new ClusterFeatureLayer({
          'id': 'firmsfirmCluster',
          'url': 'http://services.arcgis.com/oKgs2tbjK6zwTdvi/arcgis/rest/services/Major_World_Cities/FeatureServer/0',
          // 'distance': 75,
          'distance': 0,
          'labelColor': '#B00',
          'resolution': map.extent.getWidth() / map.width,
          // 'singleTemplate': infoTemplate,
          'useDefaultSymbol': false,
          'zoomOnClick': false,
          'showSingles': true,
          'objectIdField': 'FID',
          // outFields: ['NAME', 'COUNTRY', 'POPULATION', 'CAPITAL']
          opacity: 0,
          outFields: []
      });

      map.addLayer(clustersLayer)
      map.addLayer(firmClusterLayer)
      map.on('extent-change', (event) => {
        clustersLayer._reCluster()
        firmClusterLayer._reCluster()
      })

      let infoWindow = map.infoWindow,
          infoWindowContentId = 'infoWindowContent',

      mount = document.createElement('div')
      mount.id = infoWindowContentId
      mount.innerHTML = 'mountPoint'

      infoWindow.on('show, selection-change', () => {
        React.unmountComponentAtNode(mount)
        infoWindow.setContent(mount)
        React.render(<InfoWindowContent />, mount)
        infoWindow.reposition()
      })
    })
    window.map = map
    this.map = map
  }
  setSelectedBacteria (Bacteria) {
    this.selectedBacteria =Bacteria
  }

  handleSetCurentFirm (firmID){
    console.log('My motherfing map ')
  }
  handleQueryFdaSuccess (foodData) {
    let map = this.map,
        clustersLayer = map.getLayer('clusters'),
        firmClusterLayer = map.getLayer('firmsfirmCluster'),
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
          graphic.attributes = data
          clusterData.push(graphic)
        }
        clustersLayer._clusterData = clusterData
        clustersLayer._reCluster()
        clustersLayer.setOpacity(1)

        let uniqueFirmNames = Array.from(new Set([for (r of foodData) r.recalling_firm]));
        console.log(uniqueFirmNames[0])
        // debugger;
      })
  }
}, 'mapStore')





