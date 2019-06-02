"use strict";
/*
project: Messaging Web App
description: contains actions from events assigned in the page OR global Actions
author: Nicolas Maitre
version: 03.04.2019
*/
function Actions(){
	this.onMWAPageBuilt = function(options){
		console.log("mwa page built");
		//update data
		pagesManager.pages[options.pageName].elements.topMenu.userName.innerText = userObject.pseudo;
		//calls the groups list
		messagingActions.displayGroupsList();
		//hc
		//messagingActions.displayGroup({groupId: "5555-6666-7777-8888-9999", data: {name: "Les anciens du CPNV - hc"}});
	}
	//___EVENT_ACTIONS___
	//takes the input value and sends a message to selected group
	this.sendInstantMessage = function(input){
		if(!input.value){
			console.log("input is empty");
			return;
		}
		var messageObject = {
			groupId: messagingActions.currentGroup,
			text: input.value
		}
		//send message to websocket
		wsManager.sendMessage("addMessage", messageObject);
		//clear input
		input.value = "";
	}
}