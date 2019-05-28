"use strict";
/*
project: Messaging Web App
description: Contains every elements builder.
author: Nicolas Maitre
version: 03.04.2019
*/
function Builder(){
	/*Messaging Web App Page*/
	this.buildMWAPage = function(params){
		var topMenu = buildMWATopMenu(params.container);
        var mainSection = params.container.addElement("div", "MWAMainSection");
		var leftPanel = buildMWAleftPanel(mainSection);
        var rightPanel = buildMWARightPanel(mainSection);
		return{
			topMenu: topMenu,
			leftPanel: leftPanel,
            rightPanel: rightPanel
		}
	};
	function buildMWATopMenu(container){
		var element = container.addElement('div', 'MWATopMenu');
		var left = element.addElement('div', 'MWATopMenuLeftSection');
		var right = element.addElement('div', 'MWATopMenuRightSection');
		var title = left.addElement('div', 'MWATopMenuTitle');
		var user = right.addElement('div', 'MWATopMenuUserSection');
		var userName = user.addElement('div', 'MWATopMenuUserName');
		var userImage = user.addElement('div', 'MWATopMenuUserImage');
		//properties
		title.innerText = "Messaging Web App";
		userName.innerText = "...";
		userImage.style.backgroundImage = "url(images/demo/dropbox.png)";
        //return
		return {
			domElement: element,
			title: title,
			userName: userName,
			userImage: userImage
		}
	};
	function buildMWAleftPanel(container){
		var element = container.addElement('div', 'MWALeftPanel');
        var topBar = element.addElement('div', 'MWALeftPanelTopBar');
        var bottom = element.addElement('div', 'MWALeftPanelBottomSection');
        var searchInput = topBar.addElement('input', 'MWALeftPanelSearchInput');
        var searchButton = topBar.addElement('button', 'MWALeftPanelSearchButton');
		var groupsListContainer = bottom.addElement('div','MWALeftPanelGroupsListContainer');
		var addButton = bottom.addElement('button', "MWALeftPanelAddButton");
		//properties
		addButton.innerText = "+";
		searchInput.setAttribute("placeholder", "Recherche");
        //return
        return{
            domElement: element,
            searchInput: searchInput,
            searchButton: searchButton,
			addButton: addButton,
			groupsListContainer: groupsListContainer
        }
	};
    function buildMWARightPanel(container){
        //create
        var element = container.addElement("div", "MWARightPanel");
		var nameSection = element.addElement("div", "MWANameSection");
        var msgSection = element.addElement("div", "MWAMessagesSection");
        var writeSection = element.addElement("form", "MWAWriteSection");
		var nameLeftSection = nameSection.addElement("div", "MWANameLeftSection");
		var nameRightSection = nameSection.addElement("div", "MWANameRightSection");
		var nameImage = nameLeftSection.addElement("div", "MWANameSectionImage");
		var nameName = nameLeftSection.addElement("div", "MWANameSectionName");
		var namePseudo = nameLeftSection.addElement("div", "MWANameSectionPseudo");
		var nameInfoButton = nameRightSection.addElement("button", "MWANameSectionInfoButton");
        var input = writeSection.addElement("input", "MWAWriteSectionTextInput");
        var sendBtn = writeSection.addElement("button", "MWAWriteSectionSendButton");
		var noSelectedInfo = msgSection.addElement('div', "MWAMessagesSectionNoSelectedInfo");
        //properties
		var writeHeight = 30;
		msgSection.style["height"] = "calc(100% - " + (writeHeight + 10) + "px - 51px)";
        input.style["height"] = "30px";
		input.setAttribute("placeholder", "Ecrivez votre message");
		input.setAttribute("type", "text");
		nameInfoButton.innerText = "i";
		sendBtn.innerText = ">";
		noSelectedInfo.innerHTML = "Aucune discussion selectionnée<br/>Sélectionnez en une dans la liste.";
		//event
		writeSection.addEventListener("submit", function(evt){
			evt.preventDefault();
			actions.sendInstantMessage(input);
		});
		
		//test hardcoded
		nameName.innerText = "";
		nameImage.style.backgroundImage = "url(/images/demo/dropbox.png)";
		
        //return
        return{
            domElement: element,
			msgSection: msgSection,
            input: input,
            sendButton: sendBtn,
			nameImage: nameImage,
			nameText: nameName,
			namePseudo: namePseudo,
			nameInfoButton: nameInfoButton,
			noSelectInfo: noSelectedInfo
        }
    };
	
	/*Login Page*/
	this.buildLOGINPage = function(params){
		var form = buildLoginForm(params.container);
		return {
			form: form
		}
	};
	function buildLoginForm(container){
		var formWindow = container.addElement('div', 'loginFormWindow');
		var form = formWindow.addElement(/*'form'*/ 'div', 'loginForm');
		//build a user selector instead of a  login form for test purposes
		var buttonUser1 = form.addElement('button', 'loginTempUserButton');
		var buttonUser2 = form.addElement('button', 'loginTempUserButton');
		var buttonUser3 = form.addElement('button', 'loginTempUserButton');
		var buttonUser4 = form.addElement('button', 'loginTempUserButton');
		
		//properties
		buttonUser1.innerText = "nmaitre";
		buttonUser2.innerText = "nglassey";
		buttonUser3.innerText = "ggruaz";
		buttonUser4.innerText = "jlagona";
		
		//hardcoded user login events
		buttonUser1.addEventListener('click', function(){
			userObject = {
				id: "0000-0000-0000-0000-0000",
				token: "1234-1234-1234-1234-1234",
				pseudo: "nmaitre"
			};
			wsManager = new WebSocketManager();
			pagesManager.changePage('mwa');
		});
		
		buttonUser2.addEventListener('click', function(){
			userObject = {
				id: "1111-1111-1111-1111-1111",
				token: "2345-2345-2345-2345-2345",
				pseudo: "nglassey"
			};
			wsManager = new WebSocketManager();
			pagesManager.changePage('mwa');
		});
		
		buttonUser3.addEventListener('click', function(){
			userObject = {
				id: "2222-2222-2222-2222-2222",
				token: "3456-3456-3456-3456-3456",
				pseudo: "ggruaz"
			};
			wsManager = new WebSocketManager();
			pagesManager.changePage('mwa');
		});
		
		buttonUser4.addEventListener('click', function(){
			userObject = {
				id: "3333-3333-3333-3333-3333",
				token: "4567-4567-4567-4567-4567",
				pseudo: "jlagona"
			};
			wsManager = new WebSocketManager();
			pagesManager.changePage('mwa');
		});
		
		return{
			domElement: formWindow
		}
	};
	
	/*Error Page*/
	this.buildERRORPage = function(params){
		var errorContainer = params.container.addElement('div');
		errorContainer.innerHTML = globals.currentPrettyError;
		var link = params.container.addElement('a');
		link.innerText = "Retour à la page de messagerie";
		link.setAttribute('href', '#');
		link.addEventListener('click', function(evt){
			pagesManager.changePage("mwa");
		});
		return {};
	};
	/*CONTENT ADAPTERS*/ //used to build an element containeing dynamic data
	this.buildMessageAdapter = function(container, data, options = {}){
		console.log("buildMessageAdapter", data);
		/*data{
			userObject,
			text,
			imageId,
			timestamp
		}
		options{
			userApi
		}
		*/
		var extraClass = "foreignMessage";
		if(userObject.id == data.userObject.id){
			extraClass = "selfMessage";
		}
		//create
		var line = container.addElement('div', 'messageAdapterLine ' + extraClass);
		var box = line.addElement('div', 'messageAdapterBox ' + extraClass);
		var name = box.addElement('div', 'messageAdapterName');
		var textContainer = box.addElement('div', 'messageAdapterText');
		var time = box.addElement('div', 'messageAdapterTime ' + extraClass);
		
		//data
		textContainer.innerText = "";
		var displayDate = new Date(data.timestamp);
		var minutesStr = "00" + displayDate.getMinutes();
		time.innerText = displayDate.getHours() + "h" + minutesStr.substring(minutesStr.length - 2);
		name.innerText = "...";
		
		//text data
		var parsedMsg = utility.parseTextWithRegex(data.text, URL_REGEX);
		console.log("parsedMsg", parsedMsg);
		for(var indText = 0; indText < parsedMsg.texts.length; indText++){
			var textNode = document.createTextNode(parsedMsg.texts[indText]);
			textContainer.appendChild(textNode);
			if(typeof parsedMsg.matches[indText] !== "undefined"){
				var linkElem = textContainer.addElement("a", "messageAdapterTextLink");
				linkElem.setAttribute("href", parsedMsg.matches[indText]);
				linkElem.innerText = parsedMsg.matches[indText];
			}
		}
		
		//user (api call if specified)
		if(typeof options == "object" && options.userApi){
			apiManager.getUser(data.userObject.id, function(error = false, result){
				if(error){
					console.log("get user error", error);
					return;
				}
				//use api data
				name.innerText = result.first_name + " " + result.last_name;
			});
		} else {
			//use provided data
			name.innerText = data.userObject.first_name + " " + data.userObject.last_name;
		}
	};

	this.buildGroupAdapter = function(container, data, options){
		console.log("buildGroupAdapter", data);
		
		var box = container.addElement('div', 'groupAdapterContainer');
		var image = box.addElement('div', 'groupAdapterImage');
		var name = box.addElement('div', 'groupAdapterName');
		var notifPin = box.addElement('div', 'groupAdapterNotifPin none');
		
		//data
		image.style.backgroundImage = "url(images/demo/dropbox.png)";
		name.innerText = data.name;
		
		//events
		box.addEventListener("click", function(evt){
			messagingActions.displayGroup(data);
		});
	};

	this.buildDateSeparator = function(container, dateObject, groupId){
		var dateYear = dateObject.getFullYear();
		var dateMonth = dateObject.getMonth();
		var dateDay = dateObject.getDate();
		if(groupId){
			var lastDate = (messagingActions.groups[groupId].separatorDate || new Date(0));
			if((dateYear == lastDate.getFullYear()) 
			&& (dateMonth == lastDate.getMonth())
			&& (dateDay == lastDate.getDate())){
				//already built
				return false;
			}
			//set new date
			messagingActions.groups[groupId].separatorDate = dateObject;
		}
		var line = container.addElement('div', 'dateSeparatorLine');
		var box = line.addElement('div', 'dateSeparatorBox');
		var dateString = dateDay + " " + translator.get("month" + dateMonth);
		
		if((new Date(Date.now())).getFullYear() != dateYear){
			dateString += " " + dateYear;
		}
		box.innerText = dateString;
		return {
			domElement: box,
			date: dateObject
		};
	}
}