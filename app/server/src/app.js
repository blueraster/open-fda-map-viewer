import config from './config'
import {recallsByTerm} from './fetcher'
import geocoder from './geocoder'
import express from 'express'

let app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

let server = app.listen(3000, function () {
  let host = server.address().address;
  let port = server.address().port;
});

app.get('/rungeocode', function (req, res) {
  geocoder();
  res.send('hello');
});

app.get('/fetch-api-data', function (req, res) {
  recallsByTerm(config.foodCategories[1])
    .then((response) => {res.send(response)})
    // TODO: catch error
})
