"use strict";
/*
project: Messaging Web App
description: Contains every elements builder.
author: Nicolas Maitre
version: 03.04.2019
*/
function Builder() {
	var _this = this;
	/*Messaging Web App Page*/
	this.buildMWAPage = function (params) {
		var topMenu = buildMWATopMenu(params.container);
		var mainSection = params.container.addElement("div", "MWAMainSection");
		var leftPanel = buildMWAleftPanel(mainSection);
		var rightPanel = buildMWARightPanel(mainSection);
		var extra = buildMWAExtra(params.container);
		return {topMenu, leftPanel, rightPanel, extra};
	};
	function buildMWATopMenu(container) {
		var element = container.addElement('div', 'MWATopMenu');
		var left = element.addElement('div', 'MWATopMenuLeftSection');
		var right = element.addElement('div', 'MWATopMenuRightSection');
		var title = left.addElement('div', 'MWATopMenuTitle');
		var user = right.addElement('div', 'MWATopMenuUserSection');
		var userName = user.addElement('div', 'MWATopMenuUserName');
		var userImage = user.addElement('div', 'MWATopMenuUserImage');
		var userMenu = user.addElement('div', {class: 'userMenu'});
		var logOutBtn = userMenu.addElement('button', {class: 'logOutBtn', _textContent: "Log Out"});
		title.innerText = "Messaging Web App";
		userName.innerText = "...";
		userImage.style.backgroundImage = "url(images/demo/dropbox.png)";
		//events
		logOutBtn.addEventListener('click', evt=>{
			pagesManager.changePage('login');
			//TODO: use the login manager instead
		});
		//return
		return {
			domElement: element,
			title: title,
			userName: userName,
			userImage: userImage
		}
	};
	function buildMWAleftPanel(container) {
		var element = container.addElement('div', 'MWALeftPanel');
		var topBar = element.addElement('form', 'MWALeftPanelTopBar');
		var bottom = element.addElement('div', 'MWALeftPanelBottomSection');
		var menuButton = topBar.addElement("button", "MWAMenuButton");
		var searchInput = topBar.addElement('input', {class:'MWALeftPanelSearchInput', placeholder: 'Search...'});
		var searchButton = topBar.addElement('button', 'MWALeftPanelSearchButton');
		var notifsButton = bottom.addElement('button', {class:"notifsPermissionBtn none", _textContent:"Click here to activate desktop notifications"});
		var groupsListContainer = bottom.addElement('div', 'MWALeftPanelGroupsListContainer');
		var addButton = bottom.addElement('button', {class:"MWALeftPanelAddButton", _textContent: '+'});
		//events
		searchInput.addEventListener('input', evt=>messagingActions.fastGroupSearch(searchInput.value));
		searchInput.addEventListener('change', evt=>messagingActions.fastGroupSearch(searchInput.value));

		topBar.addEventListener('submit', evt=>evt.preventDefault());
		menuButton.addEventListener("click", function (evt) {
			element.classList.remove("leftMenuDisplayed");
		});
		addButton.addEventListener("click", function (evt) {
			var window = _this.displayGroupCreationWindow();
		});
		//return
		return {
			domElement: element,
			searchInput,
			searchButton,
			addButton,
			groupsListContainer,
			notifsButton
		}
	};
	function buildMWARightPanel(container) {
		//create
		var element = container.addElement("div", "MWARightPanel");
		var nameSection = element.addElement("div", "MWANameSection");
		var msgSection = element.addElement("div", "MWAMessagesSection");
		var writeSection = element.addElement("form", "MWAWriteSection none");
		var nameLeftSection = nameSection.addElement("div", "MWANameLeftSection");
		var nameRightSection = nameSection.addElement("div", "MWANameRightSection none");
		var menuButton = nameLeftSection.addElement("button", "MWAMenuButton");
		var nameImage = nameLeftSection.addElement("div", "MWANameSectionImage none");
		var nameName = nameLeftSection.addElement("div", "MWANameSectionName");
		var namePseudo = nameLeftSection.addElement("div", "MWANameSectionPseudo");
		var nameInfoButton = nameRightSection.addElement("button", "MWANameSectionInfoButton");
		var fileContainer = writeSection.addElement("div", "MWAWriteSectionFileContainer");
		var fileImage = fileContainer.addElement("div", "MWAWriteSectionFileImage");
		var fileName = fileContainer.addElement("div", "MWAWriteSectionFileName");
		var fileCloseButton = fileContainer.addElement("button", {class:"MWAWriteSectionFileCloseButton button", type:'button'});
		var input = writeSection.addElement("input", {class: "MWAWriteSectionTextInput", type: 'text', placeholder: "Type a message..."});
		var fileBtn = writeSection.addElement("button", {class:"MWAWriteSectionFileButton", type: 'button', _textContent: "+"});
		var emojiBtn = writeSection.addElement('button', {class: "writeSectionEmojiBtn", type: 'button', _textContent: "😋"})
		var sendBtn = writeSection.addElement("button", {class:"MWAWriteSectionSendButton none", type: 'submit', _textContent: ">"});
		var noSelectedInfo = msgSection.addElement('div', "MWAMessagesSectionNoSelectedInfo");
		//properties
		//var writeHeight = 30;
		//msgSection.style["height"] = "calc(100% - " + (writeHeight + 10) + "px - 51px)";
		//input.style["height"] = "30px";
		nameInfoButton.innerText = "i";
		fileCloseButton.innerText = "x";
		noSelectedInfo.innerHTML = "Aucune discussion selectionnée<br/>Sélectionnez en une dans la liste.";
		//event
		fileBtn.addEventListener("click", actions.addMessageFile);
		writeSection.addEventListener("submit", function (evt) {
			evt.preventDefault();
			messagingActions.sendInstantMessage(input);
		});

		menuButton.addEventListener("click", function (evt) {
			pagesManager.pages.mwa.elements.leftPanel.domElement.classList.add("leftMenuDisplayed");
		});
		fileCloseButton.addEventListener("click", function (evt) {
			console.log("close file container")
			element.classList.remove("writeExtended");
			if (messagingActions.groups[messagingActions.currentGroup]) {
				messagingActions.groups[messagingActions.currentGroup].saveData.file = false;
			}
		});
		nameImage.addEventListener("click", actions.zoomImage);
		//test hardcoded
		nameName.innerText = "";
		nameImage.style.backgroundImage = "url(/images/demo/dropbox.png)";

		//return
		return {
			domElement: element,
			msgSection: msgSection,
			input: input,
			sendButton: sendBtn,
			writeSection: writeSection,
			nameSection: nameSection,
			nameImage: nameImage,
			nameText: nameName,
			namePseudo: namePseudo,
			nameRightSection: nameRightSection,
			nameInfoButton: nameInfoButton,
			noSelectInfo: noSelectedInfo,
			fileContainer: fileContainer,
			fileImage: fileImage,
			fileName: fileName
		}
	};
	function buildMWAExtra(container){
		var httpsPopup = container.addElement('div', {class: 'httpsPopup none', _textContent: 'You are using the insecure version of the messaging app. Click here to switch to the https version.'});
		var closeBtn = httpsPopup.addElement('button', {_textContent:'x'});
		closeBtn.addEventListener('click', evt=>{
			evt.stopPropagation();
			httpsPopup.classList.add('none')
		});
		httpsPopup.addEventListener('click', evt=> location = location.href.replace('http://', 'https://'));
		return {httpsPopup}
	}

	/*Login Page*/
	this.buildLOGINPage = function (params) {
		var registerForm = buildRegisterForm(params.container);
		var loginForm = buildLoginForm(params.container);
		var fakeform = buildFakeLoginForm(params.container);
		return { loginForm }
	};
	function buildRegisterForm(container) {
		var formWindow = container.addElement('div', 'loginFormWindow');
		formWindow.addElement('h1', { class: 'loginFormTitle', _textContent: "Register" });
		var form = formWindow.addElement('form', 'loginForm');

		let usernameInputId = "loginFormUsernameInput";
		form.addElement('label', { for: usernameInputId, _textContent: "Username" });
		var userNameInput = form.addElement('input', { id: usernameInputId, placeholder: "ex: turbopaul45"});

		let emailInputId = "loginFormEmailInput";
		form.addElement('label', { for: emailInputId, _textContent: "Email" });
		var emailInput = form.addElement('input', { id: emailInputId, type:'email', placeholder: "ex: paul.doe@email.com"});

		let passwordInputId = "loginFormPasswordInput";
		form.addElement('label', { for: passwordInputId, _textContent: "Password" });
		var passwordInput = form.addElement('input', { id: passwordInputId, type: 'password', min: 10, placeholder: "10 characters min."});

		form.addElement('button', { type: 'submit', _textContent: 'Next...' });

		//events
		form.addEventListener('submit', evt => {
			evt.preventDefault();
			globals.registerFormInfos = {
				userName: userNameInput.value,
				email: emailInput.value,
				password: passwordInput.value
			};
			pagesManager.changePage("register")
		})
		return form
	}
	function buildLoginForm(container) {
		var formWindow = container.addElement('div', 'loginFormWindow');
		formWindow.addElement('h1', { class: 'loginFormTitle', _textContent: "Login" });
		var form = formWindow.addElement('form', 'loginForm');

		let usernameInputId = "loginFormUsernameInput";
		form.addElement('label', { for: usernameInputId, _textContent: "Username or email" });
		var userNameInput = form.addElement('input', { id: usernameInputId, placeholder: "Your username or email", required: true });
		userNameInput.focus();

		let passwordInputId = "loginFormPasswordInput";
		form.addElement('label', { for: passwordInputId, _textContent: "Password" });
		var passwordInput = form.addElement('input', { id: passwordInputId, type: 'password', placeholder: "Your password", required: true });

		form.addElement('button', { type: 'submit', _textContent: 'Enter!' });
		form.addElement('a', { href: '/reminder', _textContent: 'I forgot my password!' }).setAsDynamic()

		//events
		form.addEventListener('submit', evt => {
			evt.preventDefault();
			console.warn("not developped!")
		})
		return form
	}
	function buildFakeLoginForm(container) {
		var formWindow = container.addElement('div', 'loginFormWindow');
		var formTitle = formWindow.addElement('h1', { class: 'loginFormTitle', _textContent: "Test Users" });
		var form = formWindow.addElement(/*'form'*/ 'div', 'loginForm');
		const default_users = [
			{id: "0000-0000-0000-0000-0000", token: "1234-1234-1234-1234-1234", pseudo: "nmaitre"},
			{id: "1111-1111-1111-1111-1111", token: "2345-2345-2345-2345-2345", pseudo: "nglassey"},
			{id: "2222-2222-2222-2222-2222", token: "3456-3456-3456-3456-3456", pseudo: "ggruaz"},
			{id: "3333-3333-3333-3333-3333", token: "4567-4567-4567-4567-4567", pseudo: "euloueu"}
		];
		//build a user selector instead of a  login form for test purposes
		default_users.forEach(thisUserObject => {
			var buttonUser = form.addElement('button', 'loginTempUserButton');
			buttonUser.textContent = thisUserObject.pseudo;
			//hardcoded user login events
			buttonUser.addEventListener('click', async function (evt) {
				userObject = thisUserObject;
				await wsManager.linkUser(userObject.id)
				// wsManager = new WebSocketManager();
				pagesManager.changePage('mwa');
			});
		});

		return {
			domElement: formWindow
		}
	};

	/*Register page*/
	this.buildREGISTERPage = function(params){
		var registerForm = buildFullRegisterForm(params.container);
		return {registerForm}
	}
	function buildFullRegisterForm(container){
		var formWindow = container.addElement('div', 'loginFormWindow');
		formWindow.addElement('h1', { class: 'loginFormTitle', _textContent: "Register" });
		var form = formWindow.addElement('form', 'loginForm');

		let firstNameInputId = "registerFormfirstNameInput";
		form.addElement('label', { for: firstNameInputId, _textContent: "First Name" });
		var firstNameInput = form.addElement('input', { id: firstNameInputId, placeholder: "ex: Paul", required: true });
		firstNameInput.focus();

		let lastNameInputId = "registerFormlastNameInput";
		form.addElement('label', { for: lastNameInputId, _textContent: "First Name" });
		var lastNameInput = form.addElement('input', { id: lastNameInputId, placeholder: "ex: Doe", required: true });

		let usernameInputId = "registerFormUsernameInput";
		form.addElement('label', { for: usernameInputId, _textContent: "Username" });
		var userNameInput = form.addElement('input', { id: usernameInputId, placeholder: "ex: turbopaul45", required: true });

		let emailInputId = "registerFormEmailInput";
		form.addElement('label', { for: emailInputId, _textContent: "Email" });
		var emailInput = form.addElement('input', { id: emailInputId, type:'email', placeholder: "ex: paul.doe@email.com", required: true });

		let passwordInputId = "registerFormPasswordInput";
		form.addElement('label', { for: passwordInputId, _textContent: "Password" });
		var passwordInput = form.addElement('input', { id: passwordInputId, type: 'password', min: 5, placeholder: "Your password", required: true });

		let passwordConfInputId = "registerFormPasswordConfInput";
		form.addElement('label', { for: passwordConfInputId, _textContent: "Password confirmation" });
		var passwordConfInput = form.addElement('input', { id: passwordConfInputId, type: 'password', min: 5, placeholder: "Your password. again.", required: true });

		form.addElement('button', { type: 'submit', _textContent: 'Register!' });
		form.addElement('a', { href: '/login', _textContent: 'I already have an account' }).setAsDynamic()


		//events
		form.addEventListener('submit', evt => {
			evt.preventDefault();
			console.warn("not developped!")
		})
		return {
			domElement: form,
			userNameInput,
			emailInput,
			passwordInput
		}
	}

	/*Error Page*/
	this.buildERRORPage = function (params) {
		var errorContainer = params.container.addElement('div');
		errorContainer.innerHTML = globals.currentPrettyError;
		var link = params.container.addElement('a');
		link.innerText = "Retour à la page de messagerie";
		link.setAttribute('href', '#');
		link.addEventListener('click', function (evt) {
			pagesManager.changePage("mwa");
		});
		return {};
	};

	/*CONTENT ADAPTERS*/ //used to build an element containeing dynamic data
	this.buildMessageAdapter = function (container, data, options = {}) {
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
		if (userObject.id == data.userObject.id) {
			extraClass = "selfMessage";
		}
		//create
		var line = container.addElement('div', 'messageAdapterLine ' + extraClass);
		var box = line.addElement('div', 'messageAdapterBox ' + extraClass);
		var name = box.addElement('div', 'messageAdapterName');
		var imageContainer = box.addElement("div", "messageAdapterImageContainer");
		var image = imageContainer.addElement("div", "messageAdapterImage none");
		var textContainer = box.addElement('div', 'messageAdapterText');
		var time = box.addElement('div', 'messageAdapterTime ' + extraClass);

		//events
		image.addEventListener("click", actions.zoomImage);

		//data
		textContainer.innerText = "";
		var displayDate = new Date(data.timestamp);
		var minutesStr = "00" + displayDate.getMinutes();
		time.innerText = displayDate.getHours() + "h" + minutesStr.substring(minutesStr.length - 2);
		name.innerText = "...";
		if (data.file) {
			image.classList.remove("none");
			image.style.backgroundImage = "url(" + utility.getFileUrl(data.file) + ")";
		}

		//text data
		var parsedMsg = utility.parseTextWithRegex(data.text, URL_REGEX);
		//console.log("parsedMsg", parsedMsg);
		for (var indText = 0; indText < parsedMsg.texts.length; indText++) {
			var textNode = document.createTextNode(parsedMsg.texts[indText]);
			textContainer.appendChild(textNode);
			if (typeof parsedMsg.matches[indText] !== "undefined") {
				var linkText = parsedMsg.matches[indText];
				console.log(linkText.substring(0, 7));
				if (linkText.substring(0, 8) != "https://"
					&& linkText.substring(0, 7) != "http://") {//test http str
					linkText = "https://" + linkText;
				}
				var linkElem = textContainer.addElement("a", "messageAdapterTextLink");
				linkElem.setAttribute("href", linkText);
				linkElem.setAttribute("target", "_blank"); //open in new tab
				linkElem.setAttribute("rel", "noopener noreferrer"); //prevent resources conflict + leaks
				linkElem.innerText = parsedMsg.matches[indText];
			}
		}

		//user (api call if specified)
		if (typeof options == "object" && options.userApi) {
			apiManager.getUser(data.userObject.id, function (error = false, result) {
				if (error) {
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

	this.buildGroupAdapter = function (container, data, options) {
		console.log("buildGroupAdapter", data);

		var box = container.addElement('div', 'groupAdapterContainer');
		var image = box.addElement('div', 'groupAdapterImage');
		var name = box.addElement('div', 'groupAdapterName');
		var notifPin = box.addElement('div', {class:'groupAdapterNotifPin', _dataset:{unreadCount:0}});
		
		//data
		image.style.backgroundImage = "url(" + utility.getFileUrl(data.image) + ")";
		name.innerText = data.name;

		//events
		box.addEventListener("click", function (evt) {
			messagingActions.displayGroup(data);
		});

		//store TODO: no pls no
		messagingActions.groupAdapters[data.id] = {box, image, name, notifPin, data}
	};

	this.buildDateSeparator = function (container, dateObject, groupId) {
		var dateYear = dateObject.getFullYear();
		var dateMonth = dateObject.getMonth();
		var dateDay = dateObject.getDate();
		if (groupId) {
			var lastDate = (messagingActions.groups[groupId].separatorDate || new Date(0));
			if ((dateYear == lastDate.getFullYear())
				&& (dateMonth == lastDate.getMonth())
				&& (dateDay == lastDate.getDate())) {
				//already built
				return false;
			}
			//set new date
			messagingActions.groups[groupId].separatorDate = dateObject;
		}
		var line = container.addElement('div', 'dateSeparatorLine');
		var box = line.addElement('div', 'dateSeparatorBox');
		if (dateDay == 1) { //case of 1st/1er
			dateDay += "er";
		}
		var dateString = dateDay + " " + translator.get("month" + dateMonth);

		if ((new Date(Date.now())).getFullYear() != dateYear) {
			dateString += " " + dateYear;
		}
		box.innerText = dateString;
		return {
			domElement: box,
			date: dateObject
		};
	}

	/*WINDOWS*/
	this.newWindow = function (params) {
		/*params{
			name
			title
			onclose
		}*/

		//__BUILD
		//window
		var container = elements.windowsContainer.addElement("div", params.name + "Window window");
		var topBar = container.addElement("div", "windowTopBar");
		var topBarTitle = topBar.addElement("div", "windowTitle");
		var closeBtn = topBar.addElement("button", "windowCloseButton");
		var mainSection = container.addElement("div", "windowMainSection");

		//_PROPERTIES
		topBarTitle.innerText = params.title;
		closeBtn.innerText = "x";

		//__EVENTS
		//window
		elements.windowsContainer.addEventListener("click", function (evt) {
			closeWindow();
			params.onclose();
		});
		closeBtn.addEventListener("click", function (evt) {
			closeWindow();
			params.onclose();
		});
		container.addEventListener("click", function (evt) {
			evt.stopPropagation();
		});

		function closeWindow() {
			container.classList.add("none");
			container.remove();
			delete pagesManager.windows[params.name];
			if (Object.keys(pagesManager.windows).length === 0) { //no other windows active
				elements.windowsContainer.classList.add("none");
			}
		}
		//__SET
		pagesManager.windows[params.name] = {
			domElement: container
		};

		//__DISPLAY
		elements.windowsContainer.classList.remove("none");
		pagesManager.windows[params.name].domElement.classList.remove("none");

		//__RETURN
		return {
			domElement: container,
			title: topBarTitle,
			mainSection: mainSection,
			close: closeWindow
		};
	};

	this.displayImageSelectWindow = function (callBacks) {
		/*callBacks{
			abort: function
			file
			change
			submit
		}*/
		var allowedFiles = [
			"image/png",
			"image/jpeg",
			"image/jpg",
			"image/gif", //animated
			"image/webp" //animated
		];

		//__BUILD
		//window
		var window = _this.newWindow({
			name: "imageSelect",
			title: "Ajouter une image",
			onclose: callBacks.abort
		});
		var mainSection = window.mainSection;
		//first step
		var step1container = mainSection.addElement("div", "imageSelectWindowStep1Container");
		var dropzone = step1container.addElement("div", "imageSelectWindowDropZone button input");
		var fileInput = step1container.addElement("input", "imageSelectWindowFileInput none");
		var fakeInput = step1container.addElement("label", "imageSelectWindowFakeInput button input");
		//second step
		var step2container = mainSection.addElement("div", "imageSelectWindowStep2Container none");
		var preview = step2container.addElement("img", "imageSelectWindowPreviewImage");
		var buttonsContainer = step2container.addElement("div", "imageSelectWindowS2ButtonsContainer");
		var changeButton = buttonsContainer.addElement("button", "imageSelectWindowChangeButton");
		var submitButton = buttonsContainer.addElement("button", "imageSelectWindowSubmitButton");

		//_PROPERTIES
		fileInput.setAttribute("type", "file");
		fileInput.setAttribute("id", "fileSelectWindowFileInput");
		fileInput.setAttribute("accept", allowedFiles.join());
		fakeInput.setAttribute("for", "fileSelectWindowFileInput");
		fakeInput.innerText = "Sélectionnez des fichiers locaux";
		changeButton.innerText = "Changer d'image";
		submitButton.innerText = "Accepter";

		//__EVENTS
		//dropzone
		dropzone.addEventListener("click", function (evt) {
			fakeInput.click(evt);
		});
		dropzone.addEventListener("dragenter", function (evt) {
			evt.stopPropagation();
			dropzone.classList.add("dragover");
		});
		dropzone.addEventListener("dragleave", function (evt) {
			evt.stopPropagation();
			dropzone.classList.remove("dragover");
		});
		dropzone.addEventListener("dragover", function (evt) {
			evt.preventDefault();
		});
		dropzone.addEventListener("drop", function (evt) {
			evt.preventDefault();
			//style
			dropzone.classList.remove("dragover");
			//allowed types
			if (!allowedFiles.includes(evt.dataTransfer.items[0].type)) {
				console.log("file type not allowed", evt.dataTransfer.items[0].type);
				utility.infoMessage("Ce type de fichier n'est pas supporté.");
				return;
			}
			//return
			callBacks.file(evt.dataTransfer.items[0].getAsFile());
		});

		//file input
		fileInput.addEventListener("change", function (evt) {
			if (!allowedFiles.includes(fileInput.files[0].type)) {
				console.log("file type not allowed", fileInput.files[0].type);
				utility.infoMessage("Ce type de fichier n'est pas supporté.");
				return;
			}
			//return
			callBacks.file(fileInput.files[0]);
		});

		//buttons
		changeButton.addEventListener("click", callBacks.change);
		submitButton.addEventListener("click", callBacks.submit);

		//manual
		function displayStep1() {
			step1container.classList.remove("none");
			step2container.classList.add("none");
		}
		function displayStep2(imageData) {
			preview.src = imageData;
			step1container.classList.add("none");
			step2container.classList.remove("none");
		}

		//__RETURN
		return {
			domElement: window.domElement,
			displayStep1: displayStep1,
			displayStep2: displayStep2,
			close: window.close
		};
	};
	this.displayGroupCreationWindow = function (callBacks) {

		var selectedInfos = {
			pm: false,
			group: {
				file: false,
				users: [],
				usersCache: {},
				selfUser: false
			}
		};

		var window = _this.newWindow({
			name: "groupCreation",
			title: "Ajouter",
			onclose: onAbort
		});
		var container = window.mainSection;
		//_BUILD_
		//tabs
		var tabsContainer = container.addElement("div", "groupCreationTabsContainer");
		var pmTab = tabsContainer.addElement("div", "groupCreationTab");
		var groupTab = tabsContainer.addElement("div", "groupCreationTab selected");
		pmTab.innerText = "Créer une discussion";
		groupTab.innerText = "Créer un groupe";

		//pmSection
		var pmContainer = container.addElement("div", "groupCreationPMSection groupCreationSection none");

		//groupSection
		var groupContainer = container.addElement("div", "groupCreationGroupSection groupCreationSection");

		var groupInfos = groupContainer.addElement("div", "groupCreationGroupInfos");
		var groupImage = groupInfos.addElement("div", "groupCreationGroupImage");
		var groupNameContainer = groupInfos.addElement("div", "groupCreationGroupNameContainer");
		var groupImageButton = groupImage.addElement("button", "groupCreationGroupImageButton");
		var groupNameLabel = groupNameContainer.addElement("label", "groupCreationGroupNameLabel");
		var groupNameInput = groupNameContainer.addElement("input", "groupCreationGroupNameInput");

		var groupUsers = groupContainer.addElement("div", "groupCreationGroupUsers");
		var groupUsersTextContainer = groupUsers.addElement("div", "groupCreationGroupUsersTextContainer");
		var groupUsersTextTitle = groupUsersTextContainer.addElement("div", "groupCreationGroupUsersTextTitle");
		var groupUsersTextList = groupUsersTextContainer.addElement("div", "groupCreationGroupUsersTextList");
		var groupUsersSelector = groupUsers.addElement("div", "groupCreationGroupUsersSelector");
		var groupUsersSearch = groupUsersSelector.addElement("input", "groupCreationGroupUsersSearch");
		var groupUsersSelectorList = groupUsersSelector.addElement("div", "groupCreationGroupUsersSelectList");

		var buttonsContainer = groupContainer.addElement("div", "groupCreationButtonsContainer");
		var groupCreateButton = buttonsContainer.addElement("button", "groupCreationButton");

		//properties
		groupImageButton.innerText = "Ajouter une image";
		groupNameLabel.setAttribute("for", "groupCreationGroupName");
		groupNameLabel.innerText = "Nom du groupe";
		groupNameInput.setAttribute("id", "groupCreationGroupName");
		groupNameInput.setAttribute("type", "text");

		groupUsersTextTitle.innerText = "Ajoutez des utilisateurs dans le groupe";
		groupUsersSearch.setAttribute("type", "search");
		groupUsersSearch.setAttribute("placholder", "Rechercher");

		groupCreateButton.innerText = "Créer";

		//DATA
		//users list
		apiManager.callApi("getUsers", false, function (error, result) {
			if (error) {
				console.log("getUsers error");
				return;
			}
			for (var indUser = 0; indUser < result.length; indUser++) {
				var currentUser = result[indUser];
				//test self user
				if (userObject.id === currentUser.id) {
					selectedInfos.group.selfUser = currentUser;
					continue;
				}
				//BUILD
				var userAdapter = groupUsersSelectorList.addElement("div", "groupCreationUserAdapter groupCreationGroupUserAdapter");
				var userAdapterImage = userAdapter.addElement("div", "groupCreationUserAdapterImage");
				var userAdapterNameContainer = userAdapter.addElement("div", "groupCreationUserAdapterNameContainer");
				var userAdapterName = userAdapterNameContainer.addElement("div", "groupCreationUserAdapterName");
				var userAdapterPseudo = userAdapterNameContainer.addElement("div", "groupCreationUserAdapterPseudo");
				var userAdapterAction = userAdapter.addElement("div", "groupCreationUserAdapterAction");
				var userAdapterCheckBox = userAdapterAction.addElement("input", "groupCreationUserAdapterCheckBox");
				//properties && data
				userAdapterImage.style.backgroundImage = "url(" + utility.getFileUrl(currentUser.image) + ")";
				userAdapterName.innerText = currentUser.first_name + " " + currentUser.last_name;
				userAdapterPseudo.innerText = "@" + currentUser.pseudo;
				userAdapterCheckBox.setAttribute("type", "checkbox");
				selectedInfos.group.usersCache[currentUser.id] = currentUser;
				//events
				(function (user) {
					userAdapterCheckBox.addEventListener("change", function (evt) {
						if (evt.srcElement.checked && !selectedInfos.group.users.includes(user.id)) {
							selectedInfos.group.users.push(user.id);
						} else if (!evt.srcElement.checked && selectedInfos.group.users.includes(user.id)) {
							selectedInfos.group.users.splice(selectedInfos.group.users.indexOf(user.id), 1);
						}
						//display selected list
						var usersList = [];
						for (var indSelected = 0; indSelected < selectedInfos.group.users.length; indSelected++) {
							var selectedUser = selectedInfos.group.usersCache[selectedInfos.group.users[indSelected]];
							usersList.push(selectedUser.first_name + " " + selectedUser.last_name);
						}
						groupUsersTextList.innerText = usersList.join(", ");
					});
				})(currentUser);
			}
		});

		//_EVENTS_
		pmTab.addEventListener("click", function (evt) {
			pmTab.classList.add("selected");
			groupTab.classList.remove("selected");
			groupContainer.classList.add("none");
			pmContainer.classList.remove("none");
		});
		groupTab.addEventListener("click", function (evt) {
			pmTab.classList.remove("selected");
			groupTab.classList.add("selected");
			groupContainer.classList.remove("none");
			pmContainer.classList.add("none");
		});

		groupImageButton.addEventListener("click", function () {
			utility.imageUploadProcedure(function (error, result) {
				console.log("image result", error, result);
				if (error) {
					console.log("image upload error", error);
					infoBox("Une erreur s'est produite lors de l'ajout de l'image.");
					return;
				}
				if (!result) {
					console.log("no image returned");
					return;
				}
				//set
				selectedInfos.group.file = result;
				groupImage.style.backgroundImage = "url(" + utility.getFileUrl(result.id) + ")";
			});
		});

		groupCreateButton.addEventListener("click", function (evt) {
			//reset colors
			groupNameInput.classList.remove("error");
			groupUsersSelectorList.classList.remove("error");
			//check fields
			if (groupNameInput.value.length == 0) {
				groupNameInput.classList.add("error");
				infoBox("Veuillez entrer un nom pour le groupe.");
				return;
			}
			if (selectedInfos.group.users.length < 2) {
				groupUsersSelectorList.classList.add("error");
				infoBox("Veuillez sélectionner au moins 2 utilisateurs.");
				return;
			}
			wsManager.sendMessage("createGroup", {
				users: selectedInfos.group.users,
				name: groupNameInput.value,
				file: (selectedInfos.group.file ? selectedInfos.group.file.id : false),
				type: "group"
			}, function (error, result) {
				if (error) {
					infoBox("une erreur s'est produite lors de l'ajout du groupe");
				}
			});
			window.close();
		});

		//_ACTIONS_
		function onAbort() {

		}
	}
}