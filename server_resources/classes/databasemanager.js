"use strict";
/*
project: Messaging Web App
description: contains methods to access and manage the database
author: Nicolas Maitre
version: 03.04.2019
*/
const config = require("../config");
const mariadb = require("mariadb");
const dbName = config.dbName;

const dbPool = mariadb.createPool({ //creates an connection pool to the db
	host: 'localhost',
    user: config.dbUser, 
	database: dbName,
    password: config.dbPassword,
    connectionLimit: 5
});
function DatabaseManager(){
	var _this = this;
	//wrapper functions
	this.insertInto = async function(tableName, object, options, callBack){ //inserts data in the database
		/*options
			directFields = {};
		*/
		var textRequest = "INSERT INTO `" + tableName + "` SET ";
		var dataRequest = [];
		var directFields = {};
		if(typeof options != "undefined" && options.directFields){
			directFields = options.directFields;
		}
		
		//builds fields in request
		for(var indField in object){
			textRequest += "`" + indField + "` = ";
			
			if(directFields[indField]){ //fields that shouldn't be sql protected
				textRequest += object[indField];
			} else {
				textRequest += "?";
				dataRequest.push(object[indField]);
			}
			textRequest += ", ";
		}
		textRequest = textRequest.substr(0, textRequest.length - 2);
		textRequest += ";";
		
		console.log("insertInto request", textRequest, dataRequest);
		
		_this.queryDb(textRequest, dataRequest, callBack);//calls the database
	};
	
	this.select = async function(params = {}, callBack){ //get data from the database
		/*params
			fields (text),
			tableName (text),
			where (text),
			data(array),
			extraText (text)
			rawFields (bool)
		*/
		var dataRequest = (params.data ? params.data : []);
		//builds request
		var textRequest = "SELECT ";
		textRequest += (params.fields ? params.fields + (params.rawFields ? "":", active") : "*");
		textRequest += " FROM " + params.tableName + "";
		if(params.where){
			textRequest += " WHERE " + params.where;
		}
		if(params.extraText){
			textRequest += " " + params.extraText;
		}
		textRequest += ";";
		
		// console.log("select request:", textRequest);
		_this.queryDb(textRequest, dataRequest, function(error = false, result = false){ //calls the db
			if(error){
				callBack(error, false);
				return;
			}
			
			//clean result from metadata
			var returnResult = [];
			for(var indResult = 0; indResult < result.length; indResult++){
				var currentResult = result[indResult];
				if(currentResult.meta){
					delete currentResult.meta;
				}
				if(currentResult.active || typeof currentResult.active == 'undefined'){
					returnResult.push(currentResult)
				}
			}
			//return
			callBack(false, returnResult);
		});
	}
	
	//db query
	this.queryDb = async function(request, data, callBack){
		var dbConnection = false;
		try{
			//console.log("dbPool", dbPool);
			dbConnection = await dbPool.getConnection();
			var result = await dbConnection.query(request, data);
			callBack(false, result);
		} catch(error) {
			callBack(error);
		} finally {
			if(dbConnection){
				dbConnection.end();
			}
		}
	};
}
module.exports = new DatabaseManager();