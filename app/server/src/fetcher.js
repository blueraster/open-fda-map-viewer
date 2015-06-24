// https://api.fda.gov/food/enforcement.json?limit=100&skip=100&search=reason_for_recall:%22ice%20cream%22
import request from 'request'
import util from 'util'
import fs from 'fs'

// export fetchAllByRecall function (recallTerm) {
let fetchAllByRecall = function (recallTerm) {
  recallTerm = '%22ice%20cream%22'
  let limit = 100

  request.get(`http://api.fda.gov/food/enforcement.json?limit=${limit}&skip=${limit}&search=reason_for_recall:${recallTerm}`, function (err, res, body) {
    let json = JSON.parse(body),
        meta = json.meta,
        total = json.meta.results.total,
        results = [json.results],
        remainingPageCount = Math.floor(((total - limit) / limit) + 1),
        remainingResponseCount = remainingPageCount,
        decrement

    decrement = function () {
      remainingResponseCount--;
      if (remainingResponseCount === 0) {
        let output = {}
        output.meta = meta
        output.results = Array.prototype.concat.apply([], results)
        fs.writeFile('temp.json', JSON.stringify(output), function (error, written, buffer) {
          console.log('file written')
        });
      }
    }

    for (let i = 0; i !== remainingPageCount; i++) {
      request.get(`http://api.fda.gov/food/enforcement.json?limit=${limit}&skip=${limit * (i + 1)}&search=reason_for_recall:${recallTerm}`, function (err, res, body) {
        results.push(JSON.parse(body).results)
        decrement()
      })
    }
  })
}

fetchAllByRecall()
