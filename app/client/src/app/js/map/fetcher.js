import {map as config} from 'js/config'

let _recallsByTerm = function (recallTerm) {
  // let limit = 100,
  //     skip

  return fetch(config.requests.openFda(recallTerm))
}

let _geoDataByFood = function (food) {
  return fetch(config.requests.geoData(food))
}

export function getFoodData (food) {
  return new Promise((resolve, reject) => {
     Promise.all([_recallsByTerm(food), _geoDataByFood(food)])
        .then((results) => Promise.all([results[0].json(), results[1].json()]))
        .then(resolve)
  })
}

export {_recallsByTerm as recallsByTerm}
export {_geoDataByFood as geoDataByFood}

    // fetch(config.requests.openFda(food))
    //   .then((response) => response.json())
    //   .then((json) => console.debug(json))
    //   // TODO: catch errors
    // fetch(config.requests.geoData(food))
    //   .then((response) => response.json())
    //   .then((json) => console.debug(json))
