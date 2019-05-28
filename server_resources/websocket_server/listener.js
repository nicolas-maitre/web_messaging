"use strict";
const http = require('http');
const websocket = require('websocket');
const wsmanager = require('./ws/websocketmanager');
//const WS_PORT = 8081;
const WS_PORT = 8080;

function startServer(){
	//"http" listener
	var httpServer = http.createServer(function(req, res){
		console.log("onhttprequest");
		res.writeHead(404);
		res.end();
	});

	//websocket server
	var wsServer = new websocket.server({
		httpServer: httpServer
	});

	//listen
	httpServer.listen(WS_PORT, function(){
		console.log("server started");
	});

	//event
	wsServer.on('request', function(req){
		console.log("onrequest");
		var connection = req.accept(null, req.origin);
		wsmanager.initiateConnection(connection);
		//messages
		connection.on('message', function(msg){
			console.log("onmessage");
			if(msg.type != 'utf8'){
				return;
			}
			//process message
			wsmanager.onMessage(msg.utf8Data);
		});
		
		//close
		connection.on('close', function(connection){
			
		});
	});

	wsServer.on('upgrade', function(req, res){
		if (req.headers['upgrade'] !== 'websocket') {
			console.log("bad request");
			socket.end('HTTP/1.1 400 Bad Request');
			return;
		}
		console.log("onupgrade");
	});
}

module.exports = {startServer:startServer};