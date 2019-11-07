"use strict";
/*
project: Messaging Web App
description: contains the api actions
author: Nicolas Maitre
version: 16.05.2019
*/
const database = require('../../classes/databasemanager');
const filesmanager = require("../fs/filesmanager");
function ApiActions(){
	/*params{
		auth: {},
		params: {},
		options: {},
		data: {}
	}*/
	//get
	this.getMessages = function(actionParams, callBack){		
		if(!actionParams.params || !actionParams.params.groupId){
			callBack({clientMsg: "API getMessages requires groupId parameter"});
			return;
		}
		//create request
		database.select({
			tableName: "messages",
			where: "`group` = ?",
			extraText: "ORDER BY creation_time ASC",
			data: [actionParams.params.groupId],
		}, callBack);
	};
	this.getGroups = function(actionParams, callBack){
		if(!actionParams.params || !actionParams.params.userId){
			callBack({clientMsg: "API getGroups requires userId parameter"});
			return;
		}
		//create request
		database.select({
			fields: "id, image, `name`, `type`, administrator",
			tableName: "`groups` INNER JOIN user_groups",
			where: "user_groups.`group` = `groups`.id AND user_groups.`user` = ? AND `groups`.active = 1 AND user_groups.active = 1",
			data: [actionParams.params.userId],
			rawFields: true
		}, callBack);
	}
	this.getUser = function(actionParams, callBack){
		if(!actionParams.params || !actionParams.params.userId){
			callBack({clientMsg: "API getUser requires userId parameter"});
			return;
		}
		//create request
		database.select({
			tableName: "`users`",
			fields: "id, image, first_name, last_name, pseudo",
			where: "id = ?",
			data: [actionParams.params.userId]
		}, function(error, result){
			if(error){
				callBack(error);
				return;
			}
			if(result[0]){
				callBack(false, result[0]);
				return;
			}
			callBack({clientMsg: "no data"});
		});
	};
	this.getUsers = function(actionParams, callBack){
		//create request
		database.select({
			tableName: "`users`",
			fields: "id, image, first_name, last_name, pseudo"
		}, function(error, result){
			if(error){
				callBack(error);
				return;
			}
			callBack(false, result);
			return;
		});
	};
	//add
	this.uploadFile = function(actionParams, callBack){
		console.log("uploadFile");
		if(!actionParams.body){
			callBack({clientMsg:"no file provided"});
			return;
		}

		filesmanager.addFile({
			type: (actionParams.params.type || "file"),
			mimeType: (actionParams.params.subType ||""),
			userId: actionParams.auth.id,
			name: (actionParams.params.source_name || "")//tmp
		}, actionParams.body, callBack);
	}
}
module.exports = new ApiActions();