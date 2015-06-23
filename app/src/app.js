import express from 'express'

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
