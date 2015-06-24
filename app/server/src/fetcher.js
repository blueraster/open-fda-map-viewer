// https://api.fda.gov/food/enforcement.json?limit=100&skip=100&search=reason_for_recall:%22ice%20cream%22
import request from 'request-promise'
import util from 'util'
import fs from 'fs'

export function recallsByTerm (recallTerm) {
  // TDDO: require recallTerm, throw error if missing
  recallTerm = encodeURIComponent(`"${recallTerm}"`)
  let limit = 100,
      promise

  promise = new Promise(function (resolve, reject) {
    request.get(`http://api.fda.gov/food/enforcement.json?limit=${limit}&skip=${limit}&search=reason_for_recall:${recallTerm}`)
      .then((result) => {
        let json = JSON.parse(result),
            meta = json.meta,
            apiResults = [json.results],
            remainingPageSkips = Math.floor(((meta.results.total - limit) / limit) + 1),
            allRequests = []

        for (let i = 0; i !== remainingPageSkips; i++) {
          allRequests.push(request.get(`http://api.fda.gov/food/enforcement.json?limit=${limit}&skip=${limit * (i + 1)}&search=reason_for_recall:${recallTerm}`))
        }

        Promise.all(allRequests)
          .then((results) => {
            [for (r of results) apiResults.push(JSON.parse(r).results)]
            resolve(JSON.stringify({meta: meta, results: Array.prototype.concat.apply([], apiResults)}))
          })
          // TODO: catch errors
      })
      // TODO: catch error
  })
  return promise
}
