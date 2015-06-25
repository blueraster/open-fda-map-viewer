import {map as config} from 'js/config'

let _recallsByTerm = function (recallTerm) {
  // let limit = 100,
  //     skip

  return fetch(config.requests.openFda(recallTerm))
}

let _geoDataByFood = function (food) {
  return fetch(config.requests.geoData(food))
}

let _eventData = function () {
  return fetch(config.requests.openFdaEvent())
}

export function getFoodData (food) {
  return new Promise((resolve, reject) => {
     Promise.all([_recallsByTerm(food), _geoDataByFood(food), _eventData()])
        .then((results) => Promise.all([results[0].json(), results[1].json(), results[2].json()]))
        .then(resolve)
  })
}

export {_recallsByTerm as recallsByTerm}
export {_geoDataByFood as geoDataByFood}
