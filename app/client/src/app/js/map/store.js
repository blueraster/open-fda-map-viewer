import {dispatcher} from 'js/dispatcher'
import {actions} from 'map/actions'
import {actions as appActions} from 'app/actions'
import {map as config} from 'js/config'
import {recallsByTerm} from 'map/fetcher'
// lib/vendor/esri/dojo
import ClusterFeatureLayer from 'ClusterFeatureLayer'
import esriMap from 'esri/map'

export const store = dispatcher.createStore(class {
  constructor () {
    this.map = undefined
    this.bindListeners({
      mapInit: actions.MAP_INIT,
      queryFda: actions.QUERY_FDA
    })
  }
  mapInit () {
    this.map = new esriMap(config.id, config.options)
    // TODO: add cluster layer
    setTimeout(() => {
      let clusterLayer = new ClusterFeatureLayer({
          "url": "http://services.arcgis.com/oKgs2tbjK6zwTdvi/arcgis/rest/services/Major_World_Cities/FeatureServer/0",
          "distance": 75,
          "id": "clusters",
          "labelColor": "#fff",
          "resolution": this.map.extent.getWidth() / this.map.width,
          // "singleTemplate": infoTemplate,
          "useDefaultSymbol": false,
          "zoomOnClick": true,
          "showSingles": true,
          "objectIdField": "FID",
          outFields: ["NAME", "COUNTRY", "POPULATION", "CAPITAL"]
      });
      this.map.addLayer(clusterLayer);
    }, 3000)
  }
  queryFda (food) {
    recallsByTerm(food)
      .then((results) => {console.debug(results)})
  }
}, 'mapStore')
