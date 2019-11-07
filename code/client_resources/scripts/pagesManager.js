"use strict";
/*
project: Messaging Web App
description: manages the page building framework
author: Nicolas Maitre
version: 03.04.2019
*/
function PagesManager(){
	var _this = this;
	this.windows = {};
	this.pages = {};
	this.currentPage = ""; //default page
	
	//change current page to page name
	this.changePage = function(pageName, options = {}){
		console.log("change page from " + _this.currentPage + " to " + pageName);
		if(_this.currentPage == pageName){ //page already shown
			console.log("page already shown");
			return false;
		}
		if(!pagesConfig[pageName]){//non existant page (in structure)
			globals.currentPrettyError = "<h1>Erreur 404</h1><br/>La page demandée n'existe pas.";
			_this.changePage("error", {noPushState:true});
			console.log("this page doesn't exist");
			return false;
		}		
		var currentPageStructure = pagesConfig[pageName]; //get page config
		if(currentPageStructure.requireLogin && (!userObject.id || !userObject.token)){
			console.log("this page requires a login, defaulting to login");
			_this.changePage("login");
			return false;
		}
		
		if(_this.currentPage){//hide current page
			_this.pages[_this.currentPage].domElement.classList.add('none');
		}
		
		//page title (document)
		//document.title = "Messaging Web App - " + currentPageStructure.title;
		document.title = "Accueil / Twitter"; //TWITTER

		_this.currentPage = pageName;
		
		//page already built
		if(_this.pages[pageName] && currentPageStructure.rebuild){
			_this.pages[pageName].domElement.remove();
			delete _this.pages[pageName];
		}
		if(_this.pages[pageName]){
			_this.pages[pageName].domElement.classList.remove('none'); //show page
			return _this.pages[pageName];
		}
		
		//add new page to history
		if(!options.noPushState && !NOSERVER_ENV){
			history.pushState({pageName:pageName}, "Messaging Web App", "/" + pageName);
		}
		
		//build page
		var pageContainer = elements.pagesContainer.addElement('div', 'pageContainer ' + pageName.toUpperCase() + 'PageContainer');  //creates page container
		var pageContent = {};
		if(builder["build" + pageName.toUpperCase() + "Page"]){
			//calls the page building method formed by the page name
			pageContent = builder["build" + pageName.toUpperCase() + "Page"]({container: pageContainer, structure: currentPageStructure});
		}
		
		_this.pages[pageName] = {
			domElement: pageContainer,
			elements: pageContent
		};
		
		if(currentPageStructure.bootAction && actions[currentPageStructure.bootAction]){
			actions[currentPageStructure.bootAction]({pageName:pageName});
		}
		if(currentPageStructure.loadAction && actions[currentPageStructure.loadAction]){
			actions[currentPageStructure.loadAction]({pageName:pageName});
		}
		
		return _this.pages[pageName];
	};
	
	/*getters*/
	this.getCurrentPage = function(){
		if(_this.pages[_this.currentPage]){
			return _this.pages[_this.currentPage]
		}
		console.log("no current page???", _this.pages);
		return {};
	};
	
	/*init*/
	(function(){
		//builds the page containers container
		elements.pagesContainer = millieu.addElement('div', 'pagesContainer');
		elements.windowsContainer = millieu.addElement('div', 'windowsContainer none');
		//events
		elements.windowsContainer.addEventListener("click", function(evt){
			elements.windowsContainer.classList.add("none");
		});
	})();
}