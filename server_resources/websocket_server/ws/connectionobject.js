"use strict";
/*
project: Messaging Web App
description: class representing a websocket connection
author: Nicolas Maitre
version: 04.04.2019
*/
function ConnectionObject(connection={}, user={}){
	var _this = this;
	this.connection = {}; //ws connection
	this.user = {}; //user data
	
	/*methods*/
	this.sendMessage = function(action="", params={}, options={}){ //send ws message to user
		if(!_this.connection.sendUTF){
			console.log("connection object has no connection", _this.connection);
			return;
		}
		_this.connection.sendUTF(JSON.stringify({ //send
			action:action,
			options:params
		}));
	};
	
	/*init*/
	(function(){
		_this.connection = connection;
		_this.user = user;
	})();
}
module.exports = ConnectionObject;