"use strict";
/*
project: Messaging Web App
description: contains general use functions
author: Nicolas Maitre
version: 03.04.2019
*/
//_CONSTANTS_
//const URL_REGEX = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig; // found on stackoverflow https://stackoverflow.com/a/8943487/11548808
//const URL_REGEX = /(\bwww[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig; // found on stackoverflow https://stackoverflow.com/a/8943487/11548808
const URL_REGEX = /(\b(((https?|ftp|file):\/\/)|www.)[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig; // found on stackoverflow https://stackoverflow.com/a/8943487/11548808


//_PROTOTYPES_METHODS_
//create an child element to a dom element, you can specify a class name
Element.prototype.addElement = function(type, className, options){
	var newElement = document.createElement(type); //create
	this.appendChild(newElement); //append to parent
	if(typeof className === 'string'){
		newElement.setAttribute('class', className); //set class name
	}
	return newElement;
}
Array.prototype.remove = function(value){
    var valIndex = this.indexOf(value);
    if(valIndex != -1){
        this.splice(valIndex, 1);
        this.remove(value);
    }
    return this
}
Array.prototype.without = function(value){
    var array = [...this];
    return array.remove(value);
}

//_UTILITY_METHODS_
var utility = {};
//generates an url for querying images on the api
utility.getImageAPIUrl = function(){
	console.log("method not written yet");
}
//parses a text with a provided regex, returns texts and matches.
utility.parseTextWithRegex = function(text, regex){
	var matches = [];
	var textArray = [text];
	while(true){
		//get url
		var matchRes = regex.exec(text);
		if(!matchRes){ //no (more) urls
			break;
		}
		var match = matchRes[0];
		//split on url
		var splitted = textArray[textArray.length - 1].split(match);
		//merge second part of splitted text, including urls.
		var splitAfter = splitted.slice(1, splitted.length);
		var nextString = splitAfter[0];
		for(var indSplit = 1; indSplit < splitAfter.length; indSplit++){
			nextString += match;
			nextString += splitAfter[indSplit];
		}
		//push text and url to the respective arrays
		textArray[textArray.length - 1] = splitted[0];
		textArray.push(nextString)
		matches.push(match);
	}
	return{
		text: text,
		texts: textArray,
		matches: matches
	}
};

utility.imageUploadProcedure = function(callBack){
	console.log("image upload procedure initiated");

	var imageFile = false;
	var imageData = false;

	//display window
	var imageWindow = builder.displayImageSelectWindow({
		file: onFile,
		change: onChangeRequest,
		submit: onSubmit,
		abort: onAbort
	});

	//call backs
	function onFile(file){
		console.log("onfile", file);
		imageFile = file;
		//read file
		var fileReader = new FileReader();
		fileReader.addEventListener("load", function(evt){
			imageData = evt.target.result;
			//display second step
			imageWindow.displayStep2(imageData);
		});
		fileReader.readAsDataURL(file);
	}
	function onChangeRequest(){
		imageWindow.displayStep1();
	}
	function onSubmit(){
		console.log("submit file", imageFile);
		imageWindow.close();

		//display loader
		utility.getGlobalLoader().show();

		//upload image then return id
		apiManager.callApi("uploadFile", {body: imageFile, params:{
			type: "image",
			subType: imageFile.type,
			source_name: imageFile.name
		}}, function(error, result){
			//hide loader
			utility.getGlobalLoader().hide();
			//return
			callBack(error, result);
			return;
		});
	}
	function onAbort(){
		callBack(false, false);
		return;
	}
};

utility.infoMessage = function(message, time = 5000){
	var infoBox = document.body.addElement("div", "infoMessageBox");
	infoBox.innerText = message;
	requestAnimationFrame(function(){
		infoBox.style.opacity = 1;
		setTimeout(function(){
			infoBox.style.opacity = 0;
			setTimeout(function(){
				infoBox.remove();
			}, 0.5 * 1000);
		}, time);
	});
	return infoBox;
}
var infoBox = utility.infoMessage;

utility.getFileUrl = function(id){
	if(typeof id !== "string" || !id){
		return "/images/default.png";
	}
	return "/files/" + id
};

utility.getGlobalLoader = function(){
	if(!elements.globalLoader){
		elements.globalLoader = {};
		elements.globalLoader.container = document.body.addElement("div", "globalLoaderContainer none");
		elements.globalLoader.loader = elements.globalLoader.container.addElement("div", "globalLoaderImage");
		
		elements.globalLoader.show = function(){
			elements.globalLoader.container.classList.remove("none");
			requestAnimationFrame(function(){
				elements.globalLoader.container.style.opacity = 1;
			});
		}
		elements.globalLoader.hide = function(){
			elements.globalLoader.container.style.opacity = 0;
			setTimeout(function(){
				elements.globalLoader.container.classList.add("none");
			}, 500);
		}
	}
	return elements.globalLoader;
}
/**
 * @param {*} [{title="", body="", image=false, displayIfFocus = false, closeAfter=20000}={}]
 * @return {Notification} 
 */
utility.showDesktopNotification = function ({title="", body="", image=false, displayIfFocus = false, closeAfter=20000} = {}) {
	//test if notification are authorised
	if (typeof Notification != 'undefined' && typeof Notification.permission && Notification.permission !== "granted") {
		// if(askPermission) Notification.requestPermission(); //can't do that anymore
		console.warn("notification permission has not been granted");
		return;
	}
	//test if focused
	if (!displayIfFocus && !document.hidden && !messageObject.forceDisplay) {
		console.log('tab is focused - no desktop notification');
		return;
	}

	//shows the notification
	var notif = new Notification(title, {icon: image, body: messageObject.message});
	notif.addEventListener('click', function (evt) {
		notif.close();
		window.focus();
	});
	setTimeout(notif.close, closeAfter)

	return notif
};