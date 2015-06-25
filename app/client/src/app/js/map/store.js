import {dispatcher} from 'js/dispatcher'
import {actions} from 'map/actions'
import {actions as appActions} from 'app/actions'
import {map as config} from 'js/config'
import {getFoodData} from 'map/fetcher'
// lib/vendor/esri/dojo
import ClusterFeatureLayer from 'ClusterFeatureLayer'
import esriMap from 'esri/map'
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
          'url': 'http://services.arcgis.com/oKgs2tbjK6zwTdvi/arcgis/rest/services/Major_World_Cities/FeatureServer/0',
          'distance': 75,
          'id': 'clusters',
          'labelColor': '#fff',
          'resolution': this.map.extent.getWidth() / this.map.width,
          // 'singleTemplate': infoTemplate,
          'useDefaultSymbol': false,
          // 'zoomOnClick': true,
          'zoomOnClick': false,
          'showSingles': true,
          'objectIdField': 'FID',
          outFields: ['NAME', 'COUNTRY', 'POPULATION', 'CAPITAL']
      });
      this.map.addLayer(clusterLayer);
      this.map.on('extent-change', (event) => {
        clusterLayer._reCluster()
      })
    })
  }
  queryFda (food) {
    getFoodData(food)
      .then((results) => actions.createClusterLayer(results))
  }
  createClusterLayer (foodData) {
    console.debug('creating clusterLayer')
    console.debug(foodData)
  }
}, 'mapStore')
