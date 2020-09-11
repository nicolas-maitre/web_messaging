"use strict";
const http = require('http');
const https = require('https');
const websocket = require('websocket');
const fs = require('fs');
const wsmanager = require('./ws/websocketmanager');
const config = require('../config');
//const WS_PORT = 8081;
// const WS_PORT = config.webSocketPort;

function startServer({httpServer = null, httpsServer = null}) {
	var wsServer = null;
	var wssServer = null;

	//ws server
	wsServer = new websocket.server({ httpServer });
	wsServer.on('request', onRequest);
	wsServer.on('upgrade', onUpgrade);
	if(httpsServer){
		//wss server
		wssServer = new websocket.server({httpServer: httpsServer});
		wssServer.on('request', onRequest);
		wssServer.on('upgrade', onUpgrade);
	}
	
	function onRequest(req){
		var connection = req.accept(null, req.origin);
		wsmanager.initiateConnection(connection);
		//messages
		connection.on('message', function (msg) {
			if (msg.type != 'utf8') {
				return;
			}
			//process message
			wsmanager.onMessage(msg.utf8Data);
		});

		//close
		connection.on('close', function (connection) {
			wsmanager.closeConnection(connection);
		});
	}
	function onUpgrade(req, res){
		if (req.headers['upgrade'] !== 'websocket') {
			console.log("bad request");
			socket.end('HTTP/1.1 400 Bad Request');
			return;
		}
		console.log("onupgrade");
	}

	return {wsServer, wssServer};
}

module.exports = { startServer };