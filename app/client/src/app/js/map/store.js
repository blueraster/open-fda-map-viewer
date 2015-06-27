// TODO: massive refactoring of customFeatureLayer into own component, kick off on store map item definition/initialization
import {dispatcher} from 'js/dispatcher'
import {actions} from 'map/actions'
import {actions as appActions} from 'app/actions'
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
      handleQueryFdaSuccess: appActions.QUERY_FDA_SUCCESS
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
          'zoomOnClick': true,
          // 'zoomOnClick': false,
          'showSingles': true,
          'objectIdField': 'FID',
          // outFields: ['NAME', 'COUNTRY', 'POPULATION', 'CAPITAL']
          opacity: 0,
          outFields: []
      });
      map.addLayer(clustersLayer)
      map.on('extent-change', (event) => {
        clustersLayer._reCluster()
      })

      // let citiesLayer = new FeatureLayer('http://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Major_Cities/FeatureServer/0', {
      //   id: 'cities',
      //   // MODE: FeatureLayer.MODE_SNAPSHOT,
      //   outFields: ['NAME','ST'],
      //   visible: false
      // })
      // map.addLayer(citiesLayer)

      map.infoWindow.on('show', () => {
        // map.infoWindow.setContent(React.renderToStaticMarkup(<InfoWindowContent />))
      })
      map.infoWindow.on('selection-change', () => {
        map.infoWindow.setContent(React.renderToStaticMarkup(<InfoWindowContent />))
      })
      map.infoWindow.on('hide', () => {
        console.debug('unmount component')
      })
    })
    window.map = map
    this.map = map
  }
  setSelectedBacteria (Bacteria) {
    this.selectedBacteria =Bacteria
  }
  handleQueryFdaSuccess (foodData) {
    let map = this.map,
        clustersLayer = map.getLayer('clusters'),
        clusterData = [],
        matchedCityFoodData,
        matchedStateFoodData,
        unmatchedCityFoodData,
        unmatchedStateFoodData

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

        // debugger;
      })

    //     // citiesToQuery = Array.from(new Set([for (d of foodData) `'${d.city}'`])),
    //     citiesToQuery = Array.from(new Set([for (d of foodData) d.city])).map((c) => `'${c.replace("'","''")}'`),
    //     cityFeatures = {},

    // let chunkSize = 20,
    //     chunksLength = Math.floor(citiesToQuery.length/chunkSize) + 1,
    //     chunkIndex = 0,
    //     chunks = []

    // while (chunkIndex !== chunksLength) {
    //   chunks.push(citiesToQuery.slice(chunkSize*chunkIndex, (chunkSize*chunkIndex)+chunkSize))
    //   chunkIndex++
    // }

    // chunks = [for (c of chunks) `NAME IN (${c.join(',')})`]

    // Promise.all([for (c of chunks) fetch(config.requests.cities(c))])
    //   .then((responses) => Promise.all([for (r of responses) r.json()]))
    //   .then((jsons) => {
    //     ;[for (j of jsons) [for (f of j.features) cityFeatures[f.attributes.NAME] = {}]]
    //     ;[for (j of jsons) [for (f of j.features) cityFeatures[f.attributes.NAME][f.attributes.ST] = f]]
    //     unmatchedCityFoodData = [for (d of foodData) if (cityFeatures[d.city] === undefined) d]
    //     matchedCityFoodData = [for (d of foodData) if (cityFeatures[d.city] !== undefined) d]
    //     unmatchedStateFoodData = [for (d of matchedCityFoodData) if (cityFeatures[d.city][d.state] === undefined) d]
    //     matchedStateFoodData = [for (d of matchedCityFoodData) if (cityFeatures[d.city][d.state] !== undefined) d]

    //     console.debug(`foodData: ${foodData.length}, matched: ${matchedStateFoodData.length}, unmatched: ${unmatchedCityFoodData.length + unmatchedStateFoodData.length}, (foodData.length == (matched.length + unmatched.length): ?)`)

    //     for (let key in matchedStateFoodData) {
    //       let data = matchedStateFoodData[key],
    //           graphic = new Graphic(clustersLayer._clusterData[0].toJson()),
    //           geometry = new Point(graphic.geometry.toJson()),
    //           cityGeometry = cityFeatures[data.city][data.state].geometry

    //       geometry = geometry.setX(cityGeometry.x)
    //       geometry = geometry.setY(cityGeometry.y)
    //       graphic = graphic.setGeometry(geometry)
    //       clusterData.push(graphic)
    //     }
    //     clustersLayer._clusterData = clusterData
    //     clustersLayer._reCluster()
    //     clustersLayer.setOpacity(1)
    //   })
  }
}, 'mapStore')





