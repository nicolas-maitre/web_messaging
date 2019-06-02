"use strict";
/*
project: Messaging Web App
description: contains general use functions
author: Nicolas Maitre
version: 03.04.2019
*/
//_CONSTANTS_
const URL_REGEX = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig; // found on stackoverflow https://stackoverflow.com/a/8943487/11548808

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

utility.imageUploadProcedure = function(options){
	
};