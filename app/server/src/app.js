import config from './config'
import {recallsByTerm} from './fetcher'
import geocoder from './geocoder'
import express from 'express'

let app = express();
let geoStore = {};

// TODO: finish init function w/ callback on geoStore population completion
// init(() => {
//   console.log('hey')
// })

app.get('/', function (req, res) {
  res.send('Open FDA Map Viewer');
});

let server = app.listen(3000, function () {
  let host = server.address().address;
  let port = server.address().port;
});

app.get('/init', function (req, res) {
  for(let index in config.foodCategories){
    let category = config.foodCategories[index];
    recallsByTerm(category)
      .then((result) =>{
        geocoder(result)
          .then((result)=>{
            geoStore[category] = {category:response};
          })
      })
  }
});

// function init(callback){
//   let geocodes = [];

//   for(let index in config.foodCategories){
//     let category = config.foodCategories[index];
//     recallsByTerm(category)
//       .then((response) =>{
//         geocodes.push({category:category, promise:geocoder(response)});
//       })
//   }

//   Promise.all([for (g of geocodes) g.promise])
//     .then((results)=>{
//       console.log('#### inside all')
//       console.log(results);
//       console.log(geocodes);
//       // geoStore[category] = {category:results}
//       callback();
//     })
// }
