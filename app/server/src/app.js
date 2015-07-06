import config from './config'
import {allRecallsByTerm, recallByTerm} from './fetcher'
import geocoder from './geocoder'
import express from 'express'
import cors from 'cors'

let app = express()
let geoStore
let init

init = function (callback) {
  Promise.all([for (i of config.foodCategories) recallByTerm(i)])
  // Promise.all([for (i of config.foodCategories) allRecallsByTerm(i)])
    .then((results) => {
      Promise.all([for (r of results) geocoder(r)])
        .then((results) => {
          callback(results)
        })
    })
}

if (config.env === 'production') {
  console.log('init live data store')
  // init() ...
} else {
  console.log('init data store from cached json')
  // TODO: load a whole complete store
  geoStore = require('../data/geoStore.json')
  // TODO: refactor out cors when client is integrated into server static serving
  app.use(cors())
}

app.use(express.static('public'));

// TODO: config port
let server = app.listen(config.server.port, function () {
  let host = server.address().address
  let port = server.address().port
  console.log(`Server running on ${host}:${port}`)
})

// TODO: setup route counditional on dev environment
// app.get('/init', function (req, res) {
//   if (geoStore === undefined) {
//     geoStore = {}
//     init((results) => {
//       [for (r of results) geoStore[config.foodCategories[results.indexOf(r)]] = r]
//       res.send(`Newly generated geoStore:\n\n${JSON.stringify(geoStore)}`)
//     })
//   } else {
//     res.send(`Previously generated geoStore:\n\n${JSON.stringify(geoStore)}`)
//   }
// })

app.get('/getGeoData',function(req,res){
  res.send(geoStore)
})

// app.get('/getGeoData',function(req,res){
//   let food

//   if (req.query.food === undefined) {
//     res.status(404).send('404: Bad Request - missing food query')
//   } else {
//     food = req.query.food.trim().toLowerCase()
//   }

//   if (geoStore === undefined) {
//     res.status(500).send('500: Server Error - Resources have not been initialized')
//   } else if (geoStore[food] === undefined) {
//     res.status(500).send('500: Server Error - Resource does not exist')
//   } else {
//     res.send(geoStore[food])
//   }
// })

