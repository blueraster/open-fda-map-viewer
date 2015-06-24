import request from 'request'
import fs from 'fs'
// TODO: get all api records
// TODO: run geocode
//https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find?text=40%20East%20Rosemonts%20Alexandria%20va&maxLocations=10&outSR=102100&f=json
//export default function (datajson) {
  let data = [{
      "recall_number": "F-0283-2013",
      "reason_for_recall": "During an FDA inspection, microbiological swabs were collected and the results found that 21 sub samples in zones 1, 2 & 3 are positive for Listeria Monocytogenes (L.M.), Listeria innocua (L.I.) or Listeria seeligeri (L.S.).  The firm is voluntarily recalling all products manufactured from August 20th to September 10th 2012 due to the possible contamination.  All products with sell by dates on or before 11-OCT. No illnesses have been reported.",
      "status": "Ongoing",
      "distribution_pattern": "MI and OH only.",
      "product_quantity": "520",
      "recall_initiation_date": "20120910",
      "state": "MI",
      "event_id": "63159",
      "product_type": "Food",
      "product_description": "#011 Zucchini Stir,Fry      0.75 pounds",
      "country": "US",
      "city": "Grand Rapids",
      "recalling_firm": "Spartan Central Kitchen",
      "report_date": "20121024",
      "@epoch": 1424553174.836488,
      "voluntary_mandated": "Voluntary: Firm Initiated",
      "classification": "Class II",
      "code_info": "All with sell by dates on or before 15-Sep with UPC 0-11213-90380",
      "@id": "00028a950de0ef32fc01dc3963e6fdae7073912c0083faf0a1d1bcdf7a03c44c",
      "openfda": {},
      "initial_firm_notification": "E-Mail",
    }];
  var geocodeBaseUrl = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find?maxLocations=1&outSR=102100&f=json&text='
  var outPutJson = []
/// ToDo: Verify logic on name of city and state for one city and state
    var stream = fs.createWriteStream("my_file.txt");
    for(let d in data){
      let id = data[d]['@id'];
      let state = data[d]['state'];
      let country = data[d]['country'];
      let city = data[d]['city'];
      let loction = city+' '+state +' ' + country;
      let requestURL =  geocodeBaseUrl+encodeURIComponent(loction);

      request
        .get(requestURL)
        .pipe(fs.createWriteStream('my_file.txt'))

      request(requestURL, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          let obj = JSON.parse(body);
          let x = obj['locations'][0]['feature']['geometry']['x'];
          let y = obj['locations'][0]['feature']['geometry']['y'];
          outPutJson.push({'id':id,'x':x,'y':y});
          console.log(outPutJson);
        }
      });

    }

    //console.log(outPutJson);




  //return true;

//}

