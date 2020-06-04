var http = require("http");
var url = require("url");
var fs = require("fs");

http.createServer(function(request, response) {
  var myUrl = url.parse(request.url, true);
  var myPath = myUrl.pathname.substr(1);
  console.log(myPath);
  if (myPath == "") {
    fs.readFile('index.html', 'binary', function(err, file){
      if (err) {
        response.writeHead(404, {'Content-Type': 'text/html'});
        response.write("File not found")
        response.end();
      }
      else{
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(file, 'binary')
        response.end();
      }
    })
  }
  if(myPath.substr(0,3) == "js/") {
    fs.readFile(myPath, 'binary', function(err, file){
      if (err) {
        response.writeHead(404, {'Content-Type': 'text/html'});
        response.write("File not found")
        response.end();
      }
      else{
        response.writeHead(200, {'Content-Type': 'text/js'});
        response.write(file, 'binary')
        response.end();
      }
    })
  }
  if(myPath.substr(0,4) == "css/") {
    fs.readFile(myPath, 'binary', function(err, file){
      if (err) {
        response.writeHead(404, {'Content-Type': 'text/html'});
        response.write("File not found")
        response.end();
      }
      else{
        response.writeHead(200, {'Content-Type': 'text/css'});
        response.write(file, 'binary')
        response.end();
      }
    })
  }
  if(myPath.substr(0,7) == "medias/") {
    fs.readFile(myPath, 'binary', function(err, file){
      if (err) {
        response.writeHead(404, {'Content-Type': 'text/html'});
        response.write("File not found")
        response.end();
      }
      else{
        response.writeHead(200, {'Content-Type': 'image/svg+xml'});
        response.end(file);
      }
    })
  }
  if(myPath.substr(0,7) == "values/") {
    fs.readFile(myPath, 'binary', function(err, file){
      if (err) {
        response.writeHead(404, {'Content-Type': 'text/html'});
        response.write("File not found")
        response.end();
      }
      else{
        response.writeHead(200, {'Content-Type': 'text/json'});
        response.write(file, 'binary')
        response.end();
      }
    })
  }

  if(myPath == "classifier"){
    response.writeHead(200, {'Content-Type': 'text/json'});
    response.write("Coucou", 'binary')
    response.end();
  }

}).listen(1337);
console.log("Node.js sever running on port 1337.")
