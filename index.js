var static = require('node-static');

const PORT = 8080;

//
// Create a node-static server instance to serve the './dist' folder
//
var file = new static.Server('./dist');

require('http').createServer(function (request, response) {
  request.addListener('end', function () {
    file.serve(request, response);
  }).resume();
}).listen(PORT);

console.log('Static file server running at\n  => http://localhost:' + PORT + '/\nCTRL + C to shutdown');
