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
import ClassBreaksRenderer from 'esri/renderers/ClassBreaksRenderer'
import SimpleMarkerSymbol from 'esri/symbols/SimpleMarkerSymbol'
import SimpleLineSymbol from 'esri/symbols/SimpleLineSymbol'
import SimpleFillSymbol from 'esri/symbols/SimpleFillSymbol'
import Graphic from 'esri/graphic'
import Point from 'esri/geometry/Point'
import Color from 'dojo/_base/Color'
import on from 'dojo/on'

export const store = dispatcher.createStore(class {
  constructor () {
    this.map = undefined
    this.focusedFirmName = undefined
    this.bindListeners({
      initMap: actions.INIT_MAP,
      setSelectedBacteria: actions.SET_SELECTED_BACTERIA,
      setFocusedFirmName: actions.SET_FOCUSED_FIRM_NAME,
      handleQueryFdaSuccess: appActions.QUERY_FDA_SUCCESS,
      handleSetCurentFirm: panelActions.SET_CURRENT_FIRM
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
    defaultSym = new SimpleMarkerSymbol("circle", 16,
              new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([102,0,0, 0.55]), 3),
              new Color([255, 255, 255, 1]));

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

        renderer = new ClassBreaksRenderer(defaultSym, "clusterCount");

        // Red Clusters
        small = new SimpleMarkerSymbol("circle", 25,
            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([212,116,60,0.5]), 15),
            new Color([212,116,60,0.75]));
        medium = new SimpleMarkerSymbol("circle", 50,
            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([144,24,13,0.5]), 15),
            new Color([178,70,37,0.75]));
        large = new SimpleMarkerSymbol("circle", 80,
            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([144,24,13,0.5]), 15),
            new Color([144,24,13,0.75]));
        xlarge = new SimpleMarkerSymbol("circle", 110,
            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([102,0,0,0.5]), 15),
            new Color([102,0,0,0.75]));

        renderer.addBreak(2, 50, small);
        renderer.addBreak(50, 250, medium);
        renderer.addBreak(250, 1000, large);
        renderer.addBreak(1000, 50000, xlarge);

        firmClusterLayer.setRenderer(renderer);

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
    this.selectedBacteria =Bacteria
  }
  setFocusedFirmName (firmName) {
    this.focusedFirmName = firmName
  }
  handleSetCurentFirm (firmID){
    // debugger
    let alldata = this.map.getLayer('clusters')._clusterData
    let matchedData = [for(d of alldata) if (d.attributes.recalling_firm ===firmID) d]
    let clustersLayer = this.map.getLayer('firmsfirmCluster')
    clustersLayer._clusterData = matchedData
    clustersLayer._reCluster()
    clustersLayer.setOpacity(1)


    console.log(firmID)
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
          graphic = graphic.setAttributes(data)
          clusterData.push(graphic)
        }
        clustersLayer._clusterData = clusterData
        clustersLayer._reCluster()
        clustersLayer.setOpacity(1)

        let uniqueFirmNames = Array.from(new Set([for (r of foodData) r.recalling_firm]));
        this.handleSetCurentFirm(uniqueFirmNames[0])
        // debugger;
      })
  }
}, 'mapStore')





