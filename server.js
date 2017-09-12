var http = require("http");
var url = require("url");
var requestHandlers = require("./requestHandlers");
function start() {

	var express = require('express');
	app = express();
	var bodyParser = require('body-parser')
	
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	  extended: true
	})); 
	var json = require('express-json');
	app.use(json())

	app.use(express.static(__dirname + '/clientSide'));

	app.get('/', function (req, res) {
		res.sendFile(__dirname + '/clientSide/html/index.html')
	});
	// app.get('/listRooms',requestHandlers.listRooms)
	// app.get('/test', requestHandlers.test);
	var port = 8888;
	if(process.platform == "linux"){
		port = 8888
	}

	var server = app.listen(port);
	
	requestHandlers.initializeSockets(server);
	
	



	
	console.log("Server has started");
}

exports.start = start;