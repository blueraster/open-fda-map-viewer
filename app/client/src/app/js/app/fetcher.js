import {app as config} from 'js/config'

export function fetchFoodData (food) {
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
          allRequests.push(fetch(config.requests.ofdaRecalls(food, limit, (limit * (i +1)))))
        }

        Promise.all(allRequests)
          .then((responses) => Promise.all([for (r of responses) r.json()]))
          .then((jsons) => {
            [for (j of jsons) apiResults.push(j.results)]
            apiResults = Array.prototype.concat.apply([], apiResults)
            resolve(apiResults)
          })
      })
  })
}
