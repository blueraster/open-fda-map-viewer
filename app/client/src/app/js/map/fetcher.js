import {map as config} from 'js/config'

export function recallsByTerm (recallTerm) {
  let limit = 100,
      skip


  return new Promise((resolve, reject) => {
    fetch(config.requests.openFda(recallTerm))
      .then((response) => {

        // let json = JSON.parse(response),
        //     meta = json.meta,
        //     apiResults = [json.results],
        //     remainingPageSkips = Math.floor(((meta.results.total - limit) / limit) + 1),
        //     allRequests = []

        // for (let i = 0; i !== remainingPageSkips; i++) {
        //   allRequests.push(request.get(`http://api.fda.gov/food/enforcement.json?limit=${limit}&skip=${limit * (i + 1)}&search=reason_for_recall:${recallTerm}`))
        // }

        // Promise.all(allRequests)
        //   .then((results) => {
        //     [for (r of results) apiResults.push(JSON.parse(r).results)]
        //     resolve({meta: meta, results: Array.prototype.concat.apply([], apiResults)})
        //   })

        resolve(response)
      })
  })
}
