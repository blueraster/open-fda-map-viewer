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

// export function getFoodData (food) {
//   return new Promise((resolve, reject) => {
//      Promise.all([_recallsByTerm(food), _geoDataByFood(food), _eventData()])
//         .then((results) => Promise.all([results[0].json(), results[1].json(), results[2].json()]))
//         .then(resolve)
//   })
// }

export function getFoodData (food) {
  let limit = 100
  return new Promise((resolve, reject) => {
    fetch(config.requests.ofdaRecalls(food, limit, 0))
      .then((response) => response.json())
      .then((json) => {
        let meta = json.meta,
            apiResults = [json.results],
            remainingPageSkips = Math.floor(((meta.results.total - limit) / limit) + 1),
            allRequests = []

        for (let i = 0; i !== remainingPageSkips; i++) {
          // allRequests.push(fet))
          allRequests.push(fetch(config.requests.ofdaRecalls(food, limit, (limit * (i +1)))))
        }

        Promise.all(allRequests)
          .then((responses) => Promise.all([for (r of responses) r.json()]))
          .then((jsons) => {
            [for (j of jsons) apiResults.push(j.results)]
            apiResults = Array.prototype.concat.apply([], apiResults)

            let uniqueFirms = {},
                uniqueFirmNames,
                unique,
                getRecallsByFirm = (firm) => apiResults.filter((r) => r.recalling_firm === firm)

            uniqueFirmNames = Array.from(new Set([for (r of apiResults) r.recalling_firm]))
            ;[for (f of uniqueFirmNames) uniqueFirms[f] = {allRecalls: getRecallsByFirm(f), uniqueEventIds: []}]
            ;[for (f of uniqueFirmNames) uniqueFirms[f].uniqueEventIds = Array.from(new Set([for (r of uniqueFirms[f].allRecalls) r.event_id]))]
            console.debug(uniqueFirms)
            console.debug(uniqueFirms['Snoqualmie Gourmet Ice Cream'])
            let temp = uniqueFirms['Snoqualmlie Gourmet Ice Cream'],
                logField = (field) => [for (f of temp) console.debug(f.allRecalls)]
            debugger;
          })
      })
  })
}

export {_recallsByTerm as recallsByTerm}
export {_geoDataByFood as geoDataByFood}
