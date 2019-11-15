"use strict";
/*
project: Messaging Web App
description: contains the configuration of each page
author: Nicolas Maitre
version: 03.04.2019
*/
var pagesConfig = {
	mwa:{
		title: "Accueil / Twitter",
		requireLogin: true,
		bootAction: "onMWAPageBuilt",
		loadAction: false
	},
	login:{
		title: "LogIn",
		reloadPage:true
	},
	clock:{
		title: "Panix clox",
		bootAction: "onCLOCKPageBuilt",
	},
	admin:{
		title: "Escape game admin",
		bootAction: "onADMINPageBuilt",
	},
	error:{
		title: "Error",
		rebuild:true
	}
}