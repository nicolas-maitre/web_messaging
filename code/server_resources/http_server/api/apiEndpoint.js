"use strict";
/*
project: Messaging Web App
description: contains the api actions manager
author: Nicolas Maitre
version: 04.04.2019
*/
const querystring = require('querystring');
const apiActions = require('./apiActions');

function ApiEndpoint(){
	var _this = this;
	
	this.onRequest = function(req, urlObj, requestCallBack){ //on request event
		//console.log("onRequest apis", urlObj);
		//define action method
		var action = urlObj.pathArray[1];
		if(!apiActions[action]){
			requestCallBack({clientMsg:"invalid api action"});
			return;
		}
		//__Prepare parameters__
		var actionParams = {};
		
		//auth parameter
		if(!req.headers.auth){
			requestCallBack({clientMsg:"no auth header"}, false);
			return;
		}
		try{
			actionParams.auth = JSON.parse(req.headers.auth);
		}catch(e){
			requestCallBack({clientMsg:"invalid auth param json"}, false);
			return;
		}
		
		//params parameter
		var parsedQuery = querystring.parse(urlObj.query);
		if(parsedQuery.params){
			let URIDecoded = decodeURIComponent(parsedQuery.params);
			try{
				actionParams.params = JSON.parse(URIDecoded);
			}catch(e){
				requestCallBack({clientMsg:"invalid params json in query"}, false);
				return;
			}
		}
		
		//options parameter
		if(parsedQuery.options){ //options
			let URIDecoded = decodeURIComponent(parsedQuery.options);
			try{
				actionParams.options = JSON.parse(URIDecoded);
			}catch(e){
				requestCallBack({clientMsg:"invalid options json in query"}, false);
				return;
			}
		}
		
		//body parameter
		if(req.body){
			actionParams.body = req.body;
		}
		
		//execute action
		apiActions[action](actionParams, function(error, data){
			if(error){
				requestCallBack(error, false);
				return;
			}
			requestCallBack(false, {
				mimeType: "application/json",
				data: JSON.stringify(data)
			});
		});
	};
}
module.exports = new ApiEndpoint();