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


// function test_api_access(url,path){
// 	// Make request to server
// 	// Return's True of False 
// 	// return http.get({
// 	// 	host:url,
// 	// 	path:path,
// 	// },function(response){
// 	// 	console.log(response);
// 	// });

// 	return true;

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
// function store_new_results(){

// }




