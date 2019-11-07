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
	
	//takes the input value and sends a message to selected group
	this.sendInstantMessage = function(input){
		if(!input.value && !_this.groups[_this.currentGroup].saveData.file){
			console.log("input is empty");
			return;
		}

		var messageObject = {
			groupId: messagingActions.currentGroup,
			text: input.value,
			file: _this.groups[_this.currentGroup].saveData.file
		}

		//send message to websocket
		wsManager.sendMessage("addMessage", messageObject);
		//clear input
		input.value = "";
		_this.groups[_this.currentGroup].saveData = {text: "", file: false};
		if(!pagesManager.pages.mwa){
			console.log("mwa page not built");
			return;
		}
		pagesManager.pages.mwa.elements.rightPanel.domElement.classList.remove("writeExtended");
	}

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

		builder.buildDateSeparator(container, new Date(data.timestamp), data.groupId);
		var messageAdapter = builder.buildMessageAdapter(container, data,{userApi:true});
		
		console.log(messageAdapter);

		//TWITTER APPEND BEFORE
		container.insertBefore(messageAdapter, _this.groups[data.groupId].msgRef.nextSibling);

		if(data.groupId == _this.currentGroup){
			//scrollGroupToBottom();
			scrollGroupToTop();
		}

		//TWITTER SOUND
		if(data.userId != userObject.id){
			var audiobject = new Audio("/resources/twitter_sound.mp3");
			audiobject.play();
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
				//console.log("currentData", currentData);
			}

			//SET DEFAULT GROUP
			messagingActions.displayGroup({id:'twitter_group', name:'ok'});
		});
	}
	
	this.displayNewGroup = function(options){
		console.log("displayNewGroup", options);
		//build
		if(!pagesManager.pages.mwa){
			console.log("mwa not built");
			return;
		}
		var container = pagesManager.pages.mwa.elements.leftPanel.groupsListContainer;
		builder.buildGroupAdapter(container, options);
		//display
		_this.displayGroup(options);
	}
	//displays a group
	this.displayGroup = function(data){
		if(!pagesManager.pages["mwa"]){
			console.log("called from the wrong page, mwa not built");
			return;
		}

		var mwaElements = pagesManager.pages["mwa"].elements;

		if(_this.groups[_this.currentGroup]){
			//hide current group
			_this.groups[_this.currentGroup].msgContainer.classList.add("none");
			//save input data
			_this.groups[_this.currentGroup].saveData.text = mwaElements.rightPanel.input.value;
		}
		if(!_this.groups[data.id]){
			//build group
			_this.groups[data.id] = {
				data: data,
				msgContainer: mwaElements.rightPanel.msgSection.addElement('div', 'groupMessageSection'),
				saveData: {
					text: "",
					file: false
				}
			}
			//TWITTER START REF
			_this.groups[data.id].msgRef = _this.groups[data.id].msgContainer.addElement("div", "none");
			//get messages
			getMessagesForGroup({groupId: data.id}, function(){
				//scrollGroupToBottom();
				scrollGroupToTop();
			});
		}

		var groupSaveData = _this.groups[data.id].saveData;

		//update UI
		//display data
		mwaElements.rightPanel.nameImage.style.backgroundImage = "url(" + utility.getFileUrl(data.image) +")";
		mwaElements.rightPanel.nameText.innerText = data.name;

		mwaElements.rightPanel.input.value = groupSaveData.text;
		if(groupSaveData.file){
			mwaElements.rightPanel.fileImage.style.backgroundImage = "url(" + utility.getFileUrl(groupSaveData.file.id) + ")";
			mwaElements.rightPanel.fileName.innerText = groupSaveData.file.source_name;
			mwaElements.rightPanel.domElement.classList.add("writeExtended");
		} else {
			mwaElements.rightPanel.domElement.classList.remove("writeExtended");
		}

		//display - hide or show informations
		mwaElements.rightPanel.noSelectInfo.classList.add('none'); //hides info message
		mwaElements.rightPanel.writeSection.classList.remove('none'); //display message write section
		mwaElements.rightPanel.nameRightSection.classList.remove('none'); //display right section
		mwaElements.rightPanel.nameImage.classList.remove('none'); //display group image

		mwaElements.leftPanel.domElement.classList.remove("leftMenuDisplayed");

		_this.groups[data.id].msgContainer.classList.remove("none"); //shows discussion
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
			//for(var indMessage = 0; indMessage < data.length; indMessage++){ 
			for(var indMessage = data.length - 1; indMessage >=0; indMessage--){//NEGATE TWITTER
				var currentData = data[indMessage];
				//date separator
				var messageDate = new Date(currentData.creation_time);
				var separator = builder.buildDateSeparator(container, messageDate, options.groupId);
				//builds the message element
				var messageAdapter = builder.buildMessageAdapter(container, {
					userObject: {id: currentData.owner},
					text: currentData.text,
					file: currentData.file,
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
	function scrollGroupToTop(){
		var element = _this.groups[_this.currentGroup].msgContainer;
		element.scrollTop = 0;
	}
}