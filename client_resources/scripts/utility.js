"use strict";
/*
project: Messaging Web App
description: contains general use functions
author: Nicolas Maitre
version: 03.04.2019
*/

//create an child element to a dom element, you can specify a class name
Element.prototype.addElement = function(type, className, options){
	var newElement = document.createElement(type); //create
	this.appendChild(newElement); //append to parent
	if(typeof className === 'string'){
		newElement.setAttribute('class', className); //set class name
	}
	return newElement;
}

var utility = {};
//generates an url for querying images on the api
utility.getImageAPIUrl = function(){
	console.log("method not written yet");
}