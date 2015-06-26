import {map as config} from 'js/config'
let foodDatas = {},
    runGeocodes

runGeocodes = function (foodDatas) {
  console.log(foodDatas)
  let unique_locations = Array.from(new Set([for (food of Object.keys(foodDatas)) for(loc of foodDatas[food]) loc]))
  debugger
  // TODO:
  //   debugger;
  //   // TODO: get all unique locations
  //   // sequential geocode
}

export function geocode (foodData, food) {
  // let citiesToQuery = Array.from(new Set([for (d of foodData) d.city])).map((c) => `'${c.replace("'","''")}'`)
  let citiesToQuery = Array.from(new Set([for (d of foodData) `${d.city}|||${d.state}`]))
  foodDatas[food] = citiesToQuery
  let allFood = [for (k of Object.keys(config.foods.individual)) config.foods.individual[k]].concat(config.foods.nested[Object.keys(config.foods.nested)]).sort()
  if (Object.keys(foodDatas).sort().toString() == allFood.sort().toString()){
    runGeocodes(foodDatas);
  }

}
