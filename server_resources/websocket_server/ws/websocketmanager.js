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
const utils = require('../../classes/utils');

function WebSocketManager(listenerRef){
	const instmsgmanager = new (require('./instmsgmanager'))(this);
	
	var _this = this;
	this.connections = {}; //{connectionId: connectionObject}
    this.userConnections = {}; //{userId: [connectionId, connectionId, ...]}
    this.connectionUsers = {}; //{connectionId: userId}
	
	//event methods
	this.onMessage = function(message){ //on message event
		// console.log("websocket onMessage", message);
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
		console.log(`ws action is ${action}`);
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
	this.actionMethods.createGroup = instmsgmanager.createGroup;
	this.actionMethods.linkUserToConnection = function(params){
		// console.log("link user to connection", params);
		if(!rights.isAllowed(params.auth, "linkUserToWs", params.data)){
			console.log("user is not allowed to link himself");
			return;
        }
		_this.setConnectionUser(params.wsToken, params.data.userId);
		
		// console.log("uc cu", _this.userConnections, _this.connectionUsers)
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
        var linkedConnections = _this.getConnections(userId);
        linkedConnections.forEach(connection=>{
            connection.sendMessage(action, messageObject);
        });
	};
	//getters
	this.getConnections = function(userId){ //this gets the websocket connection by user
        if(!_this.userConnections[userId] || !_this.userConnections[userId].length){
			console.log("no linked connectionId for user", userId);
			return [];
        }
        var wsConnections = []; 
        _this.userConnections[userId].forEach(connectionId=>{
            if(_this.connections[connectionId]){
                wsConnections.push(_this.connections[connectionId]);
            }
        });
		return wsConnections;
    };
    
    this.setConnectionUser = function(connectionId, userId){
		console.log(`set connection id ${connectionId} for user id ${userId}`)
        var oldUserId = _this.connectionUsers[connectionId];
        if(oldUserId){
            _this.userConnections[oldUserId].remove(connectionId);
        }
        _this.connectionUsers[connectionId] = userId;
        _this.userConnections[userId] = [connectionId, ...(_this.userConnections[userId] || [])];
    };
}
module.exports = new WebSocketManager;