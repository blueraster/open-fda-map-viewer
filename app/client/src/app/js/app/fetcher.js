import {app as config} from 'js/config'
import {panel as panelConfig} from 'js/config'

export function fetchFoodData (food) {
  let limit = 100,
      request = config.requests.ofdaRecalls,
      fail

  if (panelConfig.classifications.indexOf(food) > -1) {
    request = config.requests.ofdaRecallsByClassification
  }

  fail = (error) => {
    if (error) {alert('Error: OVER_RATE_LIMIT\n\nYou have exceeded the Open FDA API rate limit. Please wait a moment and try again.')}
  }

  return new Promise((resolve, reject) => {
    fetch(request(food, limit, 0))
      .then((response) => response.json())
      .then((json) => {
        let meta = json.meta,
            apiResults = [json.results],
            remainingPageSkips = Math.floor(((meta.results.total - limit) / limit) + 1),
            allRequests = []

        for (let i = 0; i !== remainingPageSkips; i++) {
          allRequests.push(fetch(request(food, limit, (limit * (i +1)))))
        }

        Promise.all(allRequests)
          .then((responses) => Promise.all([for (r of responses) r.json()]))
          .then((jsons) => {
            [for (j of jsons) apiResults.push(j.results)]
            apiResults = Array.prototype.concat.apply([], apiResults)
            resolve(apiResults)
          })
          .catch(fail)
      })
      .catch(fail)
  })
}
