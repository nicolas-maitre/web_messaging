"use strict";

function WebSocketManager() {
	//const WEBSOCKET_URL = "ws://13.52.192.189:8080";
	// const WEBSOCKET_URL = "ws://localhost:8080";
	//const WEBSOCKET_URL = "ws://localhost:8081";
	const WS_PORT = config.websocketPort;
	const WEBSOCKET_URL = `ws${IS_HTTPS?'s':''}://${document.location.hostname}:${WS_PORT}`;
	var _this = this;
	this.connection;
	var callBacks = {};
	var connectionToken = false;

	/*init*/
	this.connection = new WebSocket(WEBSOCKET_URL);
	console.log("websocket connection initiated");

	//events
	this.connection.onopen = function (evt) {
		console.log("websocket connection established");
	};

	this.connection.onclose = function (evt) {
		console.log("websocket connection lost");
		infoBox("La connection au serveur a été interrompue. Essayez de recharger la page.", Infinity);
	};

	this.connection.onmessage = function (evt) {
		var data = evt.data;
		try {
			var message = JSON.parse(data);
		} catch (error) {
			console.log("error during message parse", data);
			return;
		}
		console.log("websocket message", message);
		actionOnMessage(message);
	}

	function actionOnMessage(params) {
		var action = params.action;
		console.log("message action:" + action);
		if (!_this.actionMethods[params.action]) {
			console.log("no method defined for action:", action);
			return;
		}
		_this.actionMethods[params.action](params.options);
	}

	//action methods
	this.actionMethods = {};
	this.actionMethods.initiateConnection = function (params) {
		console.log("initiate connection", params);
		//set wsToken
		connectionToken = params.connectionToken;
		//final init step
		if (callBacks.onConnectionInit) {
			callBacks.onConnectionInit.forEach(cb => cb());
		}
	}
	this.actionMethods.newMessage = function (data) {
		data.userObject = { id: data.userId };
		//notifs
		messagingActions.dispatchNewMessageNotification(data);
		//tmp
		messagingActions.displayNewMessage(data);
	};
	this.actionMethods.newGroup = function (params) {
		messagingActions.displayNewGroup(params);
	};

	//methods
	this.sendMessage = function (action, data, callBack = function () { }) {
		if (!connectionToken) {
			console.log("connection not yet established");
			callBack({ error: "connection not yet established" });
			return;
		}

		var object = {
			auth: userObject,
			wsToken: connectionToken,
			action: action,
			data: data
		}
		_this.connection.send(JSON.stringify(object));
		console.log("message sent", object);

		callBack(false);
	};
	this.linkUser = function (userId) {
		return new Promise(function (resolve, reject) {
			if (connectionToken) {
				_this.sendMessage("linkUserToConnection", { userId: userObject.id });
				resolve();
			} else {
				callBacks.onConnectionInit = [...(callBacks.onConnectionInit || []), _ => {
					_this.sendMessage("linkUserToConnection", { userId: userObject.id });
					resolve();
				}];
			}
		});
	}
}