import config from './config'
import {allRecallsByTerm, recallByTerm} from './fetcher'
import geocoder from './geocoder'
import express from 'express'

let app = express();
let geoStore;
let init;

init = function (callback) {
  Promise.all([for (i of config.foodCategories) recallByTerm(i)])
    .then((results) => {
      Promise.all([for (r of results) geocoder(r)])
        .then((results) => {
          callback(results)
        })
    })
}

app.get('/', function (req, res) {
  res.send('Open FDA Map Viewer');
});

// TODO: config port
let server = app.listen(3000, function () {
  let host = server.address().address;
  let port = server.address().port;
});

// TODO: setup route counditional on dev environment
app.get('/init', function (req, res) {
  if (geoStore === undefined) {
    geoStore = {}
    init((results) => {
      [for (r of results) geoStore[config.foodCategories[results.indexOf(r)]] = r]
      res.send(`Newly generated geoStore:\n\n${JSON.stringify(geoStore)}`)
    })
  } else {
    res.send(`Previously generated geoStore:\n\n${JSON.stringify(geoStore)}`)
  }
});

app.get('/food',function(req,res){

});

