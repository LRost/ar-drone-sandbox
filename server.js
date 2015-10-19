var http = require("http");
var drone = require("dronestream");
var fs = require("fs");


var server = http.createServer(function(req, res) {
  fs.createReadStream(__dirname + "/index.html").pipe(res);
});

drone.listen(server);
server.listen(5555);
