import request from 'request-promise'
import util from 'util'
import fs from 'fs'

export default function(data) {
  data = data.results;
  var outPutJson = []
  var maxLocations = '1';
  var outSR = '102100';
  let promise;
  let geocodesProcessed = 0;
  let index = 0;
  let outPutGeocodeObject = {};
  promise = new Promise(function (resolve, reject) {
    let requestGeocode = function(index){
      let id = data[index]['@id'];
      let location = encodeURIComponent(data[index].city+' '+data[index].state +' ' + data[index].country);
      request.get(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find?maxLocations=${maxLocations}&outSR=${outSR}&f=json&text=${location}`)
        .then(callback)
    }
    let callback = function(response){
      geocodesProcessed++;
      let id = data[index]['@id'];
      let geometry = JSON.parse(response).locations[0].feature.geometry;
      outPutGeocodeObject[id] = {geometry:geometry};
      //TODO data.length
      if (geocodesProcessed === 5){
        resolve(outPutGeocodeObject);
      }else{
        index++;
        requestGeocode(index);
      }
    }
    requestGeocode(index)
  })
  return promise;
}

