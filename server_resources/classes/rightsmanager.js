"use strict";
/*
project: Messaging Web App
description: manages the access rights
author: Nicolas Maitre
version: 03.04.2019
*/
function RightsManager(){
	this.isAllowed = function(authObject, action, params){ //determine if an action is allowed for a user
		console.log("Auth not written yet -> default to true");
		return true;
	}
}
module.exports = new RightsManager();