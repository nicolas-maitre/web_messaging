"use strict";
/*
project: Messaging Web App
description: contains file system linked methods
author: Nicolas Maitre
version: 04.04.2019
*/
const fs = require("fs");
const querystring = require("querystring");
const mime = require("mime");
const uuidv4 = require('uuid/v4');
const dbmanager = require("../../classes/databasemanager");
const config = require("../../config");

const CLIENT_RESOURCES_PATH = `${__dirname}/../../../client_resources`; //web directory path
const INDEX_FILE = "/main.html";
const FILES_DIR_PATH = config.storageDirectory;

function FilesManager(){
	//_WEB_FILES
	this.onWebRequest = function(urlObject, callBack){ //on http request, return the correct file in the website directory
		var path = INDEX_FILE; //defaults
		//console.log("exists: ", CLIENT_RESOURCES_PATH + urlObject.pathname);
		//test if file exists
		if(fs.existsSync(CLIENT_RESOURCES_PATH + urlObject.pathname)
			&& urlObject.pathname != "/"){
			path = urlObject.pathname;
		}
		getFileFromWebsitePath(path, callBack);
	};
	function getFileFromWebsitePath(path, callBack){ //gets file from path
		var pathUrl = CLIENT_RESOURCES_PATH + path;
		fs.readFile(pathUrl, function(error, data){
			//console.log("mime.getType", mime.getType(pathUrl));
			callBack(error, {
				mimeType: mime.getType(pathUrl),
				data: data
			});
		});
	}

	//_FILES_API
	this.onFilesApiRequest = function(urlObject, callBack){
		// console.log("urlObject", urlObject.pathArray);
		//extract urlObject
		if(!urlObject.pathArray[1]){
			callBack({clientMsg: "invalid filesAPI args"});
			return;
		}
		var fileId = urlObject.pathArray[1];
		//get from db
		dbmanager.select({
			fields: "subType, location",
			tableName: "files",
			where: "id=?",
			data: [fileId]
		}, function(dbError = false, dbresult){
			//req error
			if(dbError){
				dbError.clientMsg = "file not found - eo1";
				dbError.errorCode = 404;
				callBack(dbError);
				return;
			}
			//no result
			if(!dbresult[0]){
				callBack({clientMsg: "file not found - eo2", errorCode: 404});
				return;
			}

			var fileObject = dbresult[0];

			//read file
			fs.readFile(FILES_DIR_PATH + "/" + fileObject.location, function(fserror = false, fsresult){
				if(fserror){
					fserror.clientMsg = "internal file error";
					callBack(fserror);
					return;
				}
				callBack(false, {
					mimeType: fileObject.subType,
					data: fsresult
				});
			});
		});
	};
	this.addFile = function(params, data, callBack){
		/*params{
			type,
			mimeType,
			userId,
			name
		}*/

		//generate ids
		var id = uuidv4();
		var location = uuidv4();

		//store in db
		dbmanager.insertInto('files', {
			id:id, 
			type:params.type, 
			subType: params.mimeType, 
			location:location, 
			owner: params.userId, 
			source_name: params.name, 
			creation_time:"CURRENT_TIMESTAMP()"
		}, {directFields:{creation_time:true}}, 
		function(dberror, result){
			if(dberror){
				callBack(dberror);
				return;
			}
			//store in files directory
			//console.log(data.substr(0, 10));
			fs.writeFile(FILES_DIR_PATH + "/" + location, data, function(fserror){
				callBack(fserror, {
					id: id,
					source_name: params.name,
					type: params.type,
					subType: params.mimeType
				});
			});
		});
	};
}
module.exports = new FilesManager();