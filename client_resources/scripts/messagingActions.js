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
	this.groupAdapters = {};
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

		builder.buildDateSeparator(container, new Date(data.timestamp), data.groupId);
		var messageAdapter = builder.buildMessageAdapter(container, data,{userApi:true});

		if(data.groupId == _this.currentGroup){
			scrollGroupToBottom();
		}
	};

	this.onPageFocus = function(){
		if(_this.currentGroup){
			_this.setGroupAsRead(_this.currentGroup);
		}
	}
	this.dispatchNewMessageNotification = function(data){
		if(data.userObject.id == userObject.id){ //not a foreign message
			return;
		}
		if(!utility.tabHasFocus() || _this.currentGroup != data.groupId){
			//sound
			if (config.notificationSound) {
				new Audio(config.notificationSound).play();
			}
			//group badge
			if(_this.groupAdapters[data.groupId]){
				let notifPin = _this.groupAdapters[data.groupId].notifPin;
				notifPin.dataset.unreadCount = Number(notifPin.dataset.unreadCount) + 1;
			}
			globals.unreadNotifsCount++;
			actions.updatePageTitle();
		}

		if(!utility.tabHasFocus()){
			if(!_this.groupAdapters[data.groupId]){
				return console.error(`group ${data.groupId} is unavailible`);
			}
			let groupData = _this.groupAdapters[data.groupId].data;
			let deskNotif = utility.showDesktopNotification({
				title: `New message in ${groupData.name}`,  //TODO: include sender name when it will be included
				body: data.text, 
				image: utility.getFileUrl(groupData.image)
			}); 
			if(!deskNotif){
				return;
			}
			deskNotif.addEventListener('click', evt=>{
				_this.displayGroup(groupData);
			});
		}
	}
	this.setGroupAsRead = function(groupId){
		if(_this.groupAdapters[groupId]){
			let notifPin = _this.groupAdapters[groupId].notifPin;
			globals.unreadNotifsCount -= Number(notifPin.dataset.unreadCount);
			notifPin.dataset.unreadCount = 0;
			actions.updatePageTitle();
		}
	}
	
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
			console.error("called from the wrong page, mwa not built");
			return;
		}

		//notifs
		_this.setGroupAsRead(data.id);

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
				unreadMessagesCount: 0,//TODO: move that into the messages
				saveData: {
					text: "",
					file: false
				}
			}
			//get messages
			getMessagesForGroup({groupId: data.id}, function(){
				scrollGroupToBottom();
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
		// mwaElements.rightPanel.nameRightSection.classList.remove('none'); //display right section
		// mwaElements.rightPanel.nameImage.classList.remove('none'); //display group image
		mwaElements.rightPanel.nameImage.classList.remove('disabled'); //enable group image
		mwaElements.rightPanel.nameInfoButton.disabled = false; //enable info btn

		mwaElements.leftPanel.domElement.classList.remove("leftMenuDisplayed");

		_this.groups[data.id].msgContainer.classList.remove("none"); //shows discussion
		//set current group
		_this.currentGroup = data.id;
		//focus
		mwaElements.rightPanel.input.focus();
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

	this.fastGroupSearch = function(query=""){
        console.info(_this.groupAdapters);
        let searchQuery = query.trim().toLowerCase();
		for(let groupId in _this.groupAdapters){
            let groupAdapter = _this.groupAdapters[groupId];
            let searchData = groupAdapter.data.name.trim().toLowerCase();
			if(searchData.includes(searchQuery)){
				groupAdapter.box.classList.remove('none');
			}else{
				groupAdapter.box.classList.add('none');
			}
		}
	};

}