"use strict";
const validUrl = ""; //"http://nmaitre.internet-box.ch" used for dev purposes, fixes an issue with dynDNS
/*
project: Messaging Web App
description: contains function used to interact with the api
author: Nicolas Maitre
version: 03.04.2019
*/
function ApiManager(){
	var _this = this;
	this.usersCache = {/*id:userObject*/};
	/*methods*/
	this.callApi = function(action, reqParams = {}, callBack){
		/*reqParams{
			params: object
			options: object
			body: any
			use_cache: bool
		}*/
		//build url
		var fetchUrl = validUrl + "/api/" + action + "/?";
		if(reqParams.params){
			fetchUrl += "params=" + encodeURIComponent(JSON.stringify(reqParams.params)) + "&";
		}
		if(reqParams.options){
			fetchUrl += "options=" + encodeURIComponent(JSON.stringify(reqParams.options));
		}
		
		console.log("fetch url", fetchUrl);
		
		//set headers
		var fetchHeaders = new Headers([
			['Auth', JSON.stringify(userObject)]
		]);
		
		//set params
		var fetchParams = {
			method: 'POST',
            headers: fetchHeaders,
			body: reqParams.body,
			cache: (reqParams.use_cache ? "force-cache" : "no-store")	
		}
		
		console.log("fetch cache", fetchParams.cache);
		//execute request
		fetch(fetchUrl, fetchParams).then(function(response){
			return response.json();
		}).then(function(data){
			callBack(false, data);
		}).catch(function(error){
			callBack(error, false);
		});
	};
	
	//GETTERS
	this.getUser = function(userId, callBack){
		//calls api (or cache) to determine messager(user) name
		if(_this.usersCache[userId]){
			callBack(false, _this.usersCache[userId]);
			return;
		}
		_this.callApi("getUser", {params:{userId: userId}, use_cache:true}, function(error = false, result){
			if(error){
				callBack(error);
				return;
			}
			_this.usersCache[userId] = result; //store
			callBack(false, result);
		});
	}
}