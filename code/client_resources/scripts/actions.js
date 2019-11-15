"use strict";
/*
project: Messaging Web App
description: contains actions from events assigned in the page OR global Actions
author: Nicolas Maitre
version: 03.04.2019
*/
var newDate;
var timeMinute;
var timeSeconde;

function Actions(){
	var _this = this;
	var timeSeconde = 0;
	this.onMWAPageBuilt = function(options){
		console.log("mwa page built");
		//update data
		pagesManager.pages[options.pageName].elements.topMenu.userName.innerText = userObject.pseudo;
		//calls the groups list
		messagingActions.displayGroupsList();
		//hc
		//messagingActions.displayGroup({groupId: "5555-6666-7777-8888-9999", data: {name: "Les anciens du CPNV - hc"}});
	}

	this.onCLOCKPageBuilt = function(options){
		console.log("clock built lol", options);
		//start clock
		function second_passed() {
			innerClock.classList.remove('is-off');
		}
		setTimeout(second_passed, 2000)
		
		/*$('.switcher').on('click', function(e) {
			e.preventDefault();
			$('.screen').toggleClass('glitch');
		});*/

		
		var newDate = new Date();
		newDate.setDate(newDate.getDate());
		_this.resetClock(1*60+1);
		_this.startClock();
	}

	function soundTimer(timeToseconde){
		if(timeToseconde % 60 == 0){
			var timeToMinute = timeToseconde / 60;
			var audiobject = new Audio('/resources/'+timeToMinute+'min.mp3');
			audiobject.play();
		}
	}
		
	function convert(time) {
		var reste = time;
		var result = '';
	
		var nbHours = Math.floor(reste / 3600);
		reste -= nbHours * 3600
	
		var nbMinute = Math.floor(reste / 60);
		reste -= nbMinute * 60;
	
		var nbSeconds = reste;
	
		if (nbMinute < 10){
		nbMinute = "0"+ nbMinute;
		}
		if (nbSeconds < 10){
		nbSeconds = "0"+ nbSeconds;
		}
	
		//change color after 10 min
		if (nbMinute < 10){      
			pagesManager.pages.clock.domElement.classList.add("redClock");
		}
	
		//change color after 5 min red and white after 1 sec
		if (nbMinute < 5 ){
			if (nbSeconds % 2 == 0){
				pagesManager.pages.clock.domElement.classList.add("redClock");
			}else{
				pagesManager.pages.clock.domElement.classList.remove("redClock");
			}
		}
	
	
		result = nbMinute + ":" + nbSeconds;
		return result;
	}
	//all functionality for the clock
	/**
	 * method to run the clock
	 */
	this.startClock = function(){
		console.log("coucou");
		//increase each seacond
		setInterval(function(){
			_this.updateClock(-1)
		}, 1000);
	}
	/**
	 * method to stop the clock
	 */
	this.stopClock = function(){
		clearInterval(_this.updateClock);
	}
	/**
	 * method to update time on the clock
	 * @param secToUpdate int value, this value will add to actual time, give negative value to decrease and positive to add time
	 */
	this.updateClock = function(secToUpdate){
		console.log(_this.timeSeconde, secToUpdate);
		_this.timeSeconde+=secToUpdate;
		soundTimer(_this.timeSeconde);
		//if time is over
		if (_this.timeSeconde <= 0){
			var audiobject = new Audio('/resources/fin.mp3');
			audiobject.play();
			_this.timeSeconde = 0;
			_this.stopClock();
			//code to display game over
		}
		//update clock display
		var realTime = convert(_this.timeSeconde);
		innerClockTime.innerText = realTime;
		innerClockTime.setAttribute('data-time', realTime)
	}
	/**
	 * method to reset clock
	 * @param timeInMin int value, it's the start value of clock in minute
	 */
	this.resetClock = function(timeInSec){
		_this.stopClock();
		_this.timeSeconde = timeInSec;
		_this.updateClock(0);

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