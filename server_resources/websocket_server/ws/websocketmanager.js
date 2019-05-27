"use strict";
/*
project: Messaging Web App
description: contains websocket actions / management methods
author: Nicolas Maitre
version: 04.04.2019
*/

const uuidv4 = require('uuid/v4');
const ConnectionObject = require('./connectionobject');
const rights = require('../../classes/rightsmanager');

function WebSocketManager(listenerRef){
	const instmsgmanager = new (require('./instmsgmanager'))(this);
	
	var _this = this;
	this.connections = {}; //{connectionId: connectionObject}
	this.userConnections = {}; //{userId: connectionId}
	
	//event methods
	this.onMessage = function(message){ //on message event
		console.log("websocket onMessage", message);
		//parse
		try{
			var messageObject = JSON.parse(message);
		} catch(error){
			console.log("onmessage json parse error")
		}
		
		//extract action
		if(!messageObject.action){
			console.log("message has no action");
			return;
		}
		var action = messageObject.action;
		console.log("message action is ", action);
		if(!_this.actionMethods[action]){
			console.log("message action does not exist");
			return;
		}
		//callBack to assigned action method
		_this.actionMethods[action](messageObject);
	}

	//action methods
	this.actionMethods = {};
	this.actionMethods.addMessage = instmsgmanager.addMessage;
	this.actionMethods.linkUserToConnection = function(params){
		console.log("link user to connection", params);
		if(!rights.isAllowed(params.auth, "linkUserToWs", params.data)){
			console.log("user is not allowed to link himself");
			return;
		}
		_this.userConnections[params.data.userId] = params.wsToken;
	}
	//methods
	//initiates connection with user by sending him a token
	this.initiateConnection = function(connection){
		console.log("initiate websocket connection");
		do{//prevent conflict
			var token = uuidv4(); //gen token
		}while(_this.connections[token]);
		//store in memory
		var connectionObject = new ConnectionObject(connection, null);
		_this.connections[token] = connectionObject;
		
		//send to user
		connectionObject.sendMessage("initiateConnection", {
			connectionToken: token
		});
	};
	
	//send
	this.sendMessageToUser = function(userId, action, messageObject){ 
		var connection = _this.getConnection(userId);
		if(!connection){
			console.log("sendMessage error: no connection for user", userId);
			return;
		}
		connection.sendMessage(action, messageObject);
	};
	//getters
	this.getConnection = function(userId){ //this gets the websocket connection by user
		if(!_this.userConnections[userId]){
			console.log("no active ws connection for user", userId);
			return false;
		}
		var connectionId = _this.userConnections[userId];
		if(!_this.connections[connectionId]){
			console.log("no active websocket connections with id: " + connectionId);
			return false;
		}
		return _this.connections[connectionId];
	}
}
module.exports = new WebSocketManager;