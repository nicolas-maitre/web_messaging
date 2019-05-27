"use strict";
/*
project: Messaging Web App
description: contains actions directly linked with messaging
author: Nicolas Maitre
version: 03.04.2019
*/
function MessagingActions(){
	var _this = this;
	this.currentGroup = false;
	this.groups = {}; //loaded groups list
	
	// displays a new message in a group
	this.displayNewMessage = function(data, options){
		console.log("displayNewMessage data:", data);
		
		//group management before the api is working
		if(!_this.groups[data.groupId]){
			//group not built nor displayed
			return;
		}
		//zone in which the messages are built
		var container = _this.groups[data.groupId].msgContainer;
		//builds the message element
		data.userObject = {id: data.userId};

		console.log(data);

		builder.buildDateSeparator(container, new Date(data.timestamp), data.groupId);
		var messageAdapter = builder.buildMessageAdapter(container, data,{userApi:true});
		
		if(data.groupId == _this.currentGroup){
			scrollGroupToBottom();
		}
	};
	
	this.displayGroupsList = function(options){
		//call api
		apiManager.callApi("getGroups", {params:{
			userId: userObject.id
		}}, function(error, data){
			if(error){
				console.log("get groups error", error);
				return;
			}
			//call builder
			var container = pagesManager.pages.mwa.elements.leftPanel.groupsListContainer;
			for(var indGroup = 0; indGroup < data.length; indGroup++){
				var currentData = data[indGroup];
				builder.buildGroupAdapter(container, currentData);
			}
		});
	}
	
	//displays a group
	this.displayGroup = function(data){
		if(_this.groups[_this.currentGroup]){
			_this.groups[_this.currentGroup].msgContainer.classList.add("none");
		}
		if(!_this.groups[data.id]){
			//build group
			_this.groups[data.id] = {data:data};
			_this.groups[data.id].msgContainer = pagesManager.pages["mwa"].elements.rightPanel.msgSection.addElement('div', 'groupMessageSection');
			//get messages
			getMessagesForGroup({groupId: data.id}, function(){
				scrollGroupToBottom();
			});
		}
		//update UI
		if(pagesManager.pages["mwa"]){ //change header data
			pagesManager.pages["mwa"].elements.rightPanel.nameImage.style.backgroundImage = "url(images/demo/dropbox.png)";
			pagesManager.pages["mwa"].elements.rightPanel.nameText.innerText = data.name;
		}
		_this.groups[data.id].msgContainer.classList.remove("none"); //shows discussion
		pagesManager.pages["mwa"].elements.rightPanel.noSelectInfo.classList.add('none'); //hides info message
		
		//set current group
		_this.currentGroup = data.id;
	};
	
	function getMessagesForGroup(options, callBack){
		/*options{
			groupId: string
		}*/
		//call api
		apiManager.callApi("getMessages", {params: {
			groupId: options.groupId
		}}, function(error, data){
			if(error){
				console.log("getMessages error", error);
				return;
			}
			if(!_this.groups[options.groupId]){
				console.log("getMessageForGroup error: no group");
				return;
			}
			//build into container
			var container =_this.groups[options.groupId].msgContainer;
			for(var indMessage = 0; indMessage < data.length; indMessage++){
				var currentData = data[indMessage];
				//date separator
				var messageDate = new Date(currentData.creation_time);
				var separator = builder.buildDateSeparator(container, messageDate, options.groupId);
				//builds the message element
				var messageAdapter = builder.buildMessageAdapter(container, {
					userObject: {id: currentData.owner},
					text: currentData.text,
					timestamp: currentData.creation_time
				},{userApi:true});
			}
			
			callBack();
		});
	}

	function scrollGroupToBottom(){
		if(!_this.groups[_this.currentGroup]){
			console.log("no current group");
		}
		var element = _this.groups[_this.currentGroup].msgContainer;
		element.scrollTop = element.scrollHeight;
	}
}