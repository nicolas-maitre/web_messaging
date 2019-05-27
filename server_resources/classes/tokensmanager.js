"use strict";
/*
project: Messaging Web App
description: manages the connection tokens
author: Nicolas Maitre
version: 03.04.2019
*/
const uuidv4 = require('uuid/v4');
function TokensManager(){
	this.generateToken = function(type){
		var token = uuidv4();
	}
}
module.exports = new  TokensManager();