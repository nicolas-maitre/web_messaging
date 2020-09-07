"use strict";
const http = require('http');
const https = require('https');
const websocket = require('websocket');
const fs = require('fs');
const wsmanager = require('./ws/websocketmanager');
const config = require('../config');
//const WS_PORT = 8081;
const WS_PORT = config.webSocketPort;

function startServer(){
	//http/https listener
	if(!config.forceInsecure && fs.existsSync(config.httpsCertPath) && fs.existsSync(config.httpsKeyPath)){
		console.log("secure websocket server")
		var httpServer = https.createServer({
			key: fs.readFileSync(config.httpsKeyPath),
			cert: fs.readFileSync(config.httpsCertPath),
		}, onHttpReq);
	}else{
		console.log("insecure websocket server")
		var httpServer = http.createServer(onHttpReq);
	}
	function onHttpReq(req, res){
		console.log("onhttprequest (websocket)");
		res.writeHead(404);
		res.end();
	}

	//websocket server
	var wsServer = new websocket.server({httpServer});

	//listen
	httpServer.listen(WS_PORT, function(){
		console.log(`websocket server listening on port ${WS_PORT}`);
	});

	//event
	wsServer.on('request', function(req){
		var connection = req.accept(null, req.origin);
		wsmanager.initiateConnection(connection);
		//messages
		connection.on('message', function(msg){
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