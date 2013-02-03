var express = require('express');

var app = express.createServer(express.logger());
var fs = require("fs");
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/src-min'));
app.use(express.bodyParser());

var code;

function readFile(filename, defaultData, callbackFn) {
  fs.readFile(filename, function(err, data) {
    if (err) {
      console.log("Error reading file: ", filename);
      data = defaultData;
    } else {
      console.log("Success reading file: ", filename);
    }
    if (callbackFn) callbackFn(err, data);
  });
}

// Asynchronously write file contents, then call callbackFn
function writeFile(filename, data, callbackFn) {
  fs.writeFile(filename, data, function(err) {
    if (err) {
      console.log("Error writing file: ", filename);
    } else {
      console.log("Success writing file: ", filename);
    }
    if (callbackFn) callbackFn(err);
  });
}

app.get("/savedCode", function(request, response) {
	response.send({
		code: code,
		success: true
	});
});

app.post("/savedCode", function(request, response) {
	console.log("Trying to save code:", request.body.code);
	writeFile("data.txt", request.body.code);
	code = JSON.parse(request.body.code);
	response.send({
		code: code,
		success:true
	});
});

app.get('/', function(request, response) {
  response.sendfile('./index.html');
});

function initServer() {
	var defaultCode = "";
	readFile("data.txt", defaultCode, function(err, data) {
		code = JSON.parse(data);
		console.log("INITIAL CODE", code);
	});
}

initServer();
var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});