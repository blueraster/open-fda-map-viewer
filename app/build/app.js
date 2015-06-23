'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

// import chai from 'chai'
// import http from 'http'

// let assert = chai();
var app = (0, _express2['default'])();

app.get('/', function (req, res) {
		res.send('Hello World!');
		//var urlTest = test_api_access('https://api.fda.gov','/drug/enforcement.json')
		//res.send(urlTest);
});

var server = app.listen(3000, function () {

		var host = server.address().address;
		var port = server.address().port;
});

function test_api_access(url, path) {
		// Make request to server
		// Return's True of False
		// return http.get({
		// 	host:url,
		// 	path:path,
		// },function(response){
		// 	console.log(response);
		// });

		return true;
}

// function search_food(key,value){
// 	return http.get({
// 		host:url,
// 		path:path,
// 	},function(response){
// 		console.log(response);
// 	});
// }
// Ment to store the results if the data in not
function store_new_results() {}