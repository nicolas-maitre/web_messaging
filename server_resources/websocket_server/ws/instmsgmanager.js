"use strict";
/*
project: Messaging Web App
description: contains instant messaging actions (server side)
author: Nicolas Maitre
version: 04.04.2019
*/
const database = require('../../classes/databasemanager');
const rights = require('../../classes/rightsmanager');
const uuidv4 = require('uuid/v4');
function InstantMessagingManager(wsManager){
	var _this = this;
	this.addMessage = function(params){ //user sent an instant message
		console.log("add message", params);
		if(!rights.isAllowed(params.auth, "addMessage", params.data)){ //test is user is allowed to send an instant message
			console.log("user is not allowed");
			return;
		}
		
		var messageData = params.data;
		//store message
		database.insertInto("messages", { //insert into db
			id: "UUID()",
			group: messageData.groupId,
			owner: params.auth.id,
			text: messageData.text,
			file: (messageData.file) ? messageData.file.id : null,
			creation_time: "CURRENT_TIMESTAMP()"
		},{
			directFields:{id:true, creation_time:true}
		}, function(error, result){
			if(error){
				console.log("add message in db error:", error);
				return;
			}
			console.log("add message in db sucess!");
			
			//notify users in the group
			var data = {
				groupId: messageData.groupId,
				text: messageData.text,
				file: messageData.file ? messageData.file.id : false,
				userId: params.auth.id,
				timestamp: Date.now()
			};
			
			_this.notifyGroup({
				groupId: messageData.groupId,
				wsToken: params.wsToken,
				action: "newMessage",
				data: data
			});
		});
	};
	this.createGroup = function(params){
		console.log("create group params", params);
		//INSERT GROUP

		var groupId = uuidv4();

		database.insertInto("groups", { //insert into db
			id: groupId,
			image: (params.data.file || null),
			name: params.data.name,
			type: params.data.type,
			administrator: params.auth.id,
			creation_time: "CURRENT_TIMESTAMP()"
		},{
			directFields:{creation_time:true}
		}, function(error, result){
			if(error){
				console.log("add group in db step 1 error:", error);
				return;
			}
			console.log("add group in db step 1 sucess!");

			var usersList = params.data.users;
			usersList.push(params.auth.id);
			
			//INSERT RELATIONS
			for(var indUser = 0; indUser < usersList.length; indUser++){
				database.insertInto("user_groups", { //insert into db
					user: usersList[indUser],
					group: groupId,
					creation_time: "CURRENT_TIMESTAMP()"
				},{
					directFields:{creation_time:true}
				}, function(error, result){
					if(error){
						console.log("add group relations in db error:", error);
						return;
					}
					console.log("add group in db step 2 sucess!");

					//notify users in the group
					var data = {
						id: groupId,
						image: (params.data.file || false),
						creation_time: Date.now(),
						name: params.data.name,
						type: params.data.type,
						administrator: params.auth.id
					};
					
					_this.notifyGroup({
						groupId: groupId,
						wsToken: params.wsToken,
						action: "newGroup",
						data: data
					});
				});
			}
		});
	}
	this.notifyGroup = function(messageParams){
		/*messageParams{
			groupId,
			wsToken,
			action,
			data
		}*/
		console.log("wsManager?", typeof wsManager);
		//get group
		database.select({
			fields: "`user`",
			tableName: "user_groups",
			where: "`group` = ?",
			data: [messageParams.groupId]
		}, function(error = false, result = false){
			if(error){
				console.log("notifyGroup select error:", error);
				return;
			}
			console.log("notifyGroup select success: ", result);
			
			//send notif to each user in the group
			for(var indResult=0; indResult < result.length; indResult++){
				console.log("user result", result);
				var userId = result[indResult].user;
				console.log("current user id", userId);
				wsManager.sendMessageToUser(userId, messageParams.action, messageParams.data);
			}
		});
	};
}
module.exports = InstantMessagingManager;