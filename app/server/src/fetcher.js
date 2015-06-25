// SAMPLE: https://api.fda.gov/food/enforcement.json?limit=100&skip=100&search=reason_for_recall:%22ice%20cream%22
import request from 'request-promise'
import util from 'util'
import fs from 'fs'

export function recallByTerm (recallTerm) {
  let limit = 5
  return new Promise((resolve, reject) => {
    request.get(`http://api.fda.gov/food/enforcement.json?limit=${limit}&search=reason_for_recall:${recallTerm}`)
      .then((result) => resolve(JSON.parse(result)))
  })
}

export function allRecallsByTerm (recallTerm) {
  // TDDO: require recallTerm param, throw error if missing
  recallTerm = encodeURIComponent(`"${recallTerm}"`)
  let limit = 100,
      promise

  promise = new Promise(function (resolve, reject) {
    request.get(`http://api.fda.gov/food/enforcement.json?limit=${limit}&skip=${limit}&search=reason_for_recall:${recallTerm}`)
      .then((response) => {
        let json = JSON.parse(response),
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
            resolve({meta: meta, results: Array.prototype.concat.apply([], apiResults)})
          })
          // TODO: catch errors
      })
      // TODO: catch error
  })
  return promise
}
