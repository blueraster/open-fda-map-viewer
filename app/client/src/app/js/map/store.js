// TODO: massive refactoring of customFeatureLayer into own component, kick off on store map item definition/initialization
import {dispatcher} from 'js/dispatcher'
import {actions} from 'map/actions'
import {actions as appActions} from 'app/actions'
import {map as config} from 'js/config'
import {getFoodData} from 'map/fetcher'
// lib/vendor/esri/dojo
import ClusterFeatureLayer from 'ClusterFeatureLayer'
import esriMap from 'esri/map'
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
    this.map = new esriMap(config.id, config.options)
    on.once(this.map, 'extent-change', (event) => {
      let clusterLayer = new ClusterFeatureLayer({
          'id': 'clusters',
          'url': 'http://services.arcgis.com/oKgs2tbjK6zwTdvi/arcgis/rest/services/Major_World_Cities/FeatureServer/0',
          // 'distance': 75,
          'distance': 0,
          'labelColor': '#fff',
          'resolution': this.map.extent.getWidth() / this.map.width,
          // 'singleTemplate': infoTemplate,
          'useDefaultSymbol': false,
          'zoomOnClick': true,
          // 'zoomOnClick': false,
          'showSingles': true,
          'objectIdField': 'FID',
          // outFields: ['NAME', 'COUNTRY', 'POPULATION', 'CAPITAL']
          outFields: []
      });
      window.temp = clusterLayer
      this.map.addLayer(clusterLayer);
      this.map.on('extent-change', (event) => {
        clusterLayer._reCluster()
      })
    })
  }
  queryFda (food) {
    // TODO cache queries by food to just apply previously processed cluster layer data
    getFoodData(food)
      .then(actions.createClusterLayer)
  }
  createClusterLayer (foodData) {
    let apiData = foodData[0],
        geoData = foodData[1],
        clusterData = apiData.results.filter((data) => geoData[data['@id']] === undefined),
        clusterLayer = this.map.getLayer('clusters')

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
  }
}, 'mapStore')
