// Functional tests for app.js
import config from '../src/config'
import {allRecallsByTerm, recallByTerm} from '../src/fetcher'
import geocoder from '../src/geocoder'
import express from 'express'
import fs from 'fs'

// TODO: modularize app.js to access below function directly
let init
init = function (callback) {
  // Promise.all([for (i of config.foodCategories) recallByTerm(i)])
  Promise.all([for (i of config.foodCategories) allRecallsByTerm(i)])
    .then((results) => {
      Promise.all([for (r of results) geocoder(r)])
        .then((results) => {
          callback(results)
        })
    })
}

// TODO: test to generate geoStore as file to use for development
// export function generateGeoStore () {
init((results) => {
  let geoStore = {};
  [for (r of results) geoStore[config.foodCategories[results.indexOf(r)]] = r]
  fs.writeFile('data/geoStore.json', JSON.stringify(geoStore), (error) => {
    if (error) throw error
    console.log('written')
  })
})
// }

