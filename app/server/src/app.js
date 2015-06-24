import config from './config'
import {recallsByTerm} from './fetcher'
import geocoder from './geocoder'
import express from 'express'

let app = express();
let geoStore = [];

app.get('/', function (req, res) {
  res.send('Hello World!');
});

let server = app.listen(3000, function () {
  let host = server.address().address;
  let port = server.address().port;
});

app.get('/init', function (req, res) {
  for(let index in config.foodCategories){
    let category = config.foodCategories[index]
    recallsByTerm(category)
      .then((response) =>{
        geocoder(response)
          .then((response)=>{
            geoStore.push({category:response});
          })
      })
  }
});


