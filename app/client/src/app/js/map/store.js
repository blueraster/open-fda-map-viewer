// TODO: massive refactoring of customFeatureLayer into own component, kick off on store map item definition/initialization
import {dispatcher} from 'js/dispatcher'
import {actions} from 'map/actions'
import {actions as appActions} from 'app/actions'
import {map as config} from 'js/config'
import {getFoodData} from 'map/fetcher'
// lib/vendor/esri/dojo
import ClusterFeatureLayer from 'ClusterFeatureLayer'
import esriMap from 'esri/map'
import FeatureLayer from 'esri/layers/FeatureLayer'
import Graphic from 'esri/graphic'
import Point from 'esri/geometry/Point'
import on from 'dojo/on'

export const store = dispatcher.createStore(class {
  constructor () {
    this.map = undefined
    this.bindListeners({
      mapInit: actions.MAP_INIT,
      queryFda: actions.QUERY_FDA,
      createClusterLayer: actions.CREATE_CLUSTER_LAYER
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

      let clusterLayer = new ClusterFeatureLayer({
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
      map.addLayer(clusterLayer)
      map.on('extent-change', (event) => {
        clusterLayer._reCluster()
      })

      let citiesLayer = new FeatureLayer('http://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Major_Cities/FeatureServer/0', {
        'id': 'cities',
        'visible': false
      })
      map.addLayer(citiesLayer)

    })

    window.map = map
    this.map = map
  }
  queryFda (food) {
    // TODO cache queries by food to just apply previously processed cluster layer data
    getFoodData(food)
      // .then(actions.createClusterLayer)
      .then((foodData) => {
        console.debug(foodData)
      })
  }
  createClusterLayer (foodData) {
    let map = this.map
    let apiData = foodData[0],
        geoData = foodData[1],
        clusterData = apiData.results.filter((data) => geoData[data['@id']] === undefined),
        clusterLayer = map.getLayer('clusters')

    // console.debug(apiData)
    // debugger

    // TODO: fix server-client data to be complete, just render entire geostore for now
    clusterData = []
    for (let key in geoData) {
      let graphic = new Graphic(clusterLayer._clusterData[0].toJson()),
          geometry = new Point(graphic.geometry.toJson())

      geometry = geometry.setX(geoData[key].geometry.x)
      geometry = geometry.setY(geoData[key].geometry.y)
      graphic = graphic.setGeometry(geometry)
      clusterData.push(graphic)
    }

    clusterLayer._clusterData = clusterData
    clusterLayer._reCluster()
    clusterLayer.setOpacity(1)

    // map event point
    let fdaEvent = foodData[2].results[0],
        citiesLayer = map.getLayer('cities'),
        statesLayer = map.getLayer('states')

    console.log(fdaEvent)

    citiesLayer.setDefinitionExpression(`ST = '${fdaEvent.state}' AND NAME = '${fdaEvent.city}'`)
    citiesLayer.setVisibility(true)
    citiesLayer.on('click', (event) => {
      let content = Object.keys(fdaEvent).map((key) => `<div>${key}: ${fdaEvent[key]}</div>`).join('')
      map.infoWindow.setFeatures([event.graphic])
      map.infoWindow.setContent(`<div>${content}</div>`)
      map.infoWindow.show(event.screenPoint)

      let fdaStates = fdaEvent.distribution_pattern.split(', ').map((state) => `'${state}'`)
      statesLayer.setDefinitionExpression(`STATE_ABBR IN (${fdaStates})`)
      statesLayer.setVisibility(true)
    })
  }
}, 'mapStore')





