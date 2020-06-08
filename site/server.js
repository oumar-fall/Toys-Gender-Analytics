var http = require("http");
var url = require("url"); //url
var fs = require("fs"); //files
var net = require('net');
var querystring = require('querystring');
var formidable = require('formidable');

var PORT = (process.argv[2])? process.argv[2] : 8000;

http.createServer(function(request, response) {
  var myUrl = url.parse(request.url, true);
  var myPath = myUrl.pathname.substr(1);

  if (myPath == "") { //lanch website
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
  if(myPath.substr(0,3) == "js/") { //launch js
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
  if(myPath.substr(0,4) == "css/") { //launch css
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
  if(myPath.substr(0,5) == "temp/") {
    fs.readFile(myPath, function(err, file){
      if (err) {
        response.writeHead(404, {'Content-Type': 'text/html'});
        response.write("File not found")
        response.end();
      }
      else{
        response.writeHead(200, {'Content-Type': 'image/*'});
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

  if(myPath.substr(0,5) == "data/") { //database
    fs.readFile(myPath, 'binary', function(err, file){
      if (err) {
        response.writeHead(404, {'Content-Type': 'text/html'});
        response.write("File not found")
        response.end();
      }
      else{
        response.writeHead(200, {'Content-Type': 'text/tsv'});
        response.write(file, 'binary')
        response.end();
      }
    })
  }

  if(myPath == "classifier"){ //connexion with python server

    var client = new net.Socket();
    console.log('URL : ' + myUrl.search);
    var foo = querystring.parse(myUrl.search.substr(1)).filetoupload;
    client.connect(8484, '127.0.0.1', function() {
        console.log('Connected : ' + foo);
        client.write(foo);
    });
    client.on('data', function(data) {
        response.writeHead(200, {'Content-Type': 'text/json'});
        response.write(data, 'binary')
        response.end();
        console.log('Received: ' + data);
        client.destroy(); // kill client after server's response
    });
  }
  if(myPath == "imageupload"){
    var form = new formidable.IncomingForm();
    form.parse(request, function (err, fields, files) {
      var oldpath = files.imagepath.path;
      var newpath = encodeURI('temp/' + files.imagepath.name);
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        response.write('<span>File loaded :</span><img class="uploadPreview" src="' + newpath + '" alt="uploaded Image">');
        response.end();
      });
   });
  
  }

}).listen(PORT);
console.log("Node.js sever running on port " + PORT + '.')
