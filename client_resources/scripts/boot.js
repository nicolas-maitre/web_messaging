"use strict";
/*
project: Messaging Web App
description: first js file that is called when the html page is loaded, defines global values and inits page construction.
author: Nicolas Maitre
version: 03.04.2019
*/
const IS_HTTPS = window.isSecureContext && window.location.protocol == 'https:'

var userObject = {id: "", token: "", pseudo:""};
var elements = {};
var groups = {};
var globals = {currentPrettyError:"", messageFile: false, unreadNotifsCount:0};

//classes (singletons)
var builder = new Builder();
var pagesManager = new PagesManager();
var wsManager = new WebSocketManager();
var actions = new Actions();
var messagingActions = new MessagingActions();
var apiManager = new ApiManager();
var actions = new Actions();
var translator = new Translator();

//start by history
var pageName = "login"; //default page
if(!NOSERVER_ENV){ //used when developping offline
	var pageFromUrl = window.location.pathname.split("/")[1];
	if(pageFromUrl){
		pageName = pageFromUrl;
	}
}
pagesManager.changePage(pageName, {isPopState:/*server false, noserver true*/NOSERVER_ENV});

//history popstate, called on page navigation
window.addEventListener("popstate", function(evt){
	if(evt.state.pageName){
		//change page to history page
		pagesManager.changePage(evt.state.pageName, {noPushState:true});
	}
});

//focusxd
document.addEventListener('focus', evt=>{
	messagingActions.onPageFocus(evt);
});