"use strict";
/*
project: Messaging Web App
description: contains actions from events assigned in the page OR global Actions
author: Nicolas Maitre
version: 03.04.2019
*/
function Actions(){
	this.onMWAPageBuilt = function(options){
		var thisPageElements = pagesManager.pages[options.pageName].elements
		console.log("mwa page built");
		//update data
		thisPageElements.topMenu.userName.innerText = userObject.pseudo;
		//https
		if(!IS_HTTPS){
			thisPageElements.extra.httpsPopup.classList.remove('none');
		}
		//notifs button
		let notifsButton = thisPageElements.leftPanel.notifsButton;
		if(Notification.permission !== "granted"){
			notifsButton.classList.remove('none');
			notifsButton.addEventListener('click', async evt=>{
				await Notification.requestPermission()
				if(Notification.permission == "granted"){
					notifsButton.classList.add('none');
					utility.infoMessage("😊")
				}else{
					utility.infoMessage("😟")
				}
			});
		}
		//calls the groups list
		messagingActions.displayGroupsList();
	}
	this.onREGISTERPageLoad = function(options){
		console.info("register loaded", options);
		var registerForm = pagesManager.pages[options.pageName].elements.registerForm;
		let formInfos = globals.registerFormInfos || {}
		if(formInfos.userName) registerForm.userNameInput.value = formInfos.userName
		if(formInfos.email) registerForm.emailInput.value = formInfos.email
		if(formInfos.password) registerForm.passwordInput.value = formInfos.password
		
	}

	this.updatePageTitle = function(){
		document.title = `${globals.unreadNotifsCount? `(${globals.unreadNotifsCount}) `:''}Cat-Chat - ${pagesManager.currentPage}`;
	}

	this.addMessageFile = function(evt){
		console.log("file btn");
		utility.imageUploadProcedure(function(error, result){
			console.log("imageUploadProcedure", error, result);
			if(error){
				console.log("image upload error", error);
				infoBox("Une erreur s'est prduite lors de l'ajout de l'image");
				return;
			}
			if(!result){
				console.log("abort");
				return;
			}
			if(!pagesManager.pages.mwa){
				console.log("mwa page not built");
				return;
			}
			var mwaElements = pagesManager.pages.mwa.elements;
			mwaElements.rightPanel.fileImage.style.backgroundImage = "url(" + utility.getFileUrl(result.id) + ")";
			mwaElements.rightPanel.fileName.innerText = result.source_name;
			mwaElements.rightPanel.domElement.classList.add("writeExtended");

			//set file in group save data
			messagingActions.groups[messagingActions.currentGroup].saveData.file = result;
		});;
	}

	this.zoomImage = function(evt){
		var OPACITY_SPEED = 0.2;
		var ZOOM_SPEED = 0.3;
		//build
		if(!elements.zoomImage){
			elements.zoomImage = {};
			elements.zoomImage.background = document.body.addElement("div", "imageZoomBackground none");
			elements.zoomImage.image = elements.zoomImage.background.addElement("div", "imageZoomImage");
			elements.zoomImage.exitButton = elements.zoomImage.background.addElement("button", "imageZoomExitButton button");
			elements.zoomImage.background.addEventListener("click", function(evt2){
				console.log("exit zoom", bounds);
				var newBounds = elements.zoomImage.bounds;
				//animate
				image.style.left = newBounds.left;
				image.style.top = newBounds.top;
				image.style.width = newBounds.width;
				image.style.height = newBounds.height;
				setTimeout(function(){
					background.style.opacity = 0;
					setTimeout(function(){
						background.classList.add("none");
					}, OPACITY_SPEED * 1000)
				}, ZOOM_SPEED * 1000);
			});
			//properties
			elements.zoomImage.exitButton.innerText = "x";
			elements.zoomImage.background.style.transition = "opacity " + OPACITY_SPEED + "s";
		}
		var background = elements.zoomImage.background;
		var image = elements.zoomImage.image;
		var exitButton = elements.zoomImage.exitButton;
		var bounds = evt.target.getBoundingClientRect();
		elements.zoomImage.bounds = bounds;
		//set first step
		image.style.backgroundImage = evt.target.style.backgroundImage;
		image.style.left = bounds.left;
		image.style.top = bounds.top;
		image.style.width = bounds.width;
		image.style.height = bounds.height;
		image.style.transition = "";
		//animate
		background.classList.remove("none");
		requestAnimationFrame(function(){
			background.style.opacity = 0;
			requestAnimationFrame(function(){
				//animate background opacity
				background.style.opacity = 1;
				image.style.transition = ZOOM_SPEED + "s";
				setTimeout(function(){
					image.style.left = "";
					image.style.top = "";
					image.style.width = "";
					image.style.height = "";
				}, OPACITY_SPEED * 1000);
			});
		});
	}
}