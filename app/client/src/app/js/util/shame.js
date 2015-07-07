import {map as config} from 'js/config'



let foodDatas = {},
    runGeocodes

runGeocodes = function (foodDatas) {
  console.log(foodDatas)
  let unique_locations = Array.from(new Set([for (food of Object.keys(foodDatas)) for(loc of foodDatas[food]) loc]))
  let getGeoCodeRequest = (location) => `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find?maxLocations=1&outSR=102100&f=json&text=${location}`


  let addressArray = [for ( location of unique_locations) getGeoCodeRequest(`${location.split("|||")[0]} ${location.split("|||")[1]} USA`) ]

  let geoDataStore  = {}

  let formatData = function(){
    window.mygeoDataStore =geoDataStore
  }

  let requestGeocode = function(){
    let curentAddress = unique_locations.pop()
    if (curentAddress !== undefined){
      fetch(getGeoCodeRequest(curentAddress.replace("|||"," ")))
        .then((response) => response.json())
        .then((json) => {
            callback(json,curentAddress)
        })
    } else {
      formatData()
    }
  }

  let callback = function(json,curentAddress){
    //Format and store info globale
    console.log(curentAddress)
    let state = curentAddress.split("|||")[1]
    let city = curentAddress.split("|||")[0]

    if (geoDataStore[state] ===undefined){
      geoDataStore[state] = {}
    }
    geoDataStore[state][city] = {
      'x':json.locations[0].feature.geometry.x,
      'y':json.locations[0].feature.geometry.y
    }
    requestGeocode()

  }

  requestGeocode()
}

export function geocode (foodData, food) {
  // let citiesToQuery = Array.from(new Set([for (d of foodData) d.city])).map((c) => `'${c.replace("'","''")}'`)
  debugger
  let citiesToQuery = Array.from(new Set([for (d of foodData) `${d.city}|||${d.state}`]))
  foodDatas[food] = citiesToQuery
  let allFood = [for (k of Object.keys(config.foods.individual)) config.foods.individual[k]].concat(config.foods.nested[Object.keys(config.foods.nested)]).sort()
  if (Object.keys(foodDatas).sort().toString() == allFood.sort().toString()){
    runGeocodes(foodDatas);
  }




















}
