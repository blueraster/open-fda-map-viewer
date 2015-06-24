import config from './config'
import express from 'express'
import {recallsByTerm} from './fetcher'

let app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
  //var urlTest = test_api_access('https://api.fda.gov','/drug/enforcement.json')
  //res.send(urlTest);
});

let server = app.listen(3000, function () {
  let host = server.address().address;
  let port = server.address().port;
});

app.get('/rungeocode', function (req, res) {
  res.send('Hello World!');
  //var urlTest = test_api_access('https://api.fda.gov','/drug/enforcement.json')
  //res.send(urlTest);
});

app.get('/fetch-api-data', function (req, res) {
  recallsByTerm(config.foodCategories[1])
    .then((response) => {res.send(response)})
    // TODO: catch error
})
