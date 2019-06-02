"use strict";
/*
project: Messaging Web App
description: contains instant messaging actions (server side)
author: Nicolas Maitre
version: 04.04.2019
*/
const database = require('../../classes/databasemanager');
const rights = require('../../classes/rightsmanager');
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