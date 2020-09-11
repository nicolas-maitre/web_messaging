"use strict";
/*
project: Messaging Web App
description: listens on the http port and redistributes requests
author: Nicolas Maitre
version: 04.04.2019
*/
const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const filesmanager = require("./fs/filesmanager");
const api = require("./api/apiEndpoint");
const config = require("../config");
//const HTTP_PORT = 81;
const HTTP_PORT = config.httpPort;
const HTTPS_PORT = config.httpsPort;

const HTTPS_CERT_PATH = config.httpsCertPath;
const HTTPS_KEY_PATH = config.httpsKeyPath;

function startServer() {
	var httpServer = null;
	var httpsServer = null;
	//HTTPS SWITCH
	if (!config.forceInsecure && HTTPS_PORT
		&& HTTPS_CERT_PATH && HTTPS_KEY_PATH
		&& fs.existsSync(HTTPS_CERT_PATH) && fs.existsSync(HTTPS_CERT_PATH)
	) {
		console.log("Secure env availible");
		httpsServer = https.createServer({
			key: fs.readFileSync(HTTPS_KEY_PATH),
			cert: fs.readFileSync(HTTPS_CERT_PATH),
		}, onRequestStart);
		httpsServer.listen(HTTPS_PORT);
		console.log(`https server listening on port ${HTTPS_PORT}`);
	} else {
		console.log("secure env not availible");
	}
	var httpServer = http.createServer(onRequestStart);
	httpServer.listen(HTTP_PORT);
	console.log(`http server listening on port ${HTTP_PORT}`);
	console.log(`local server url: http://localhost:${HTTP_PORT}`)

	function onRequest(request, result) {//request event
		// console.log("[" + (new Date(Date.now())).toDateString() + "] http request received from: " + request.connection.remoteAddress);
		//parse url to get the request endpoint
		var parsedUrl = url.parse(request.url);
		var pathArray = parsedUrl.pathname.split("/");
		pathArray.shift();
		parsedUrl.pathArray = pathArray;
		var endpoint = pathArray[0];
		switch (endpoint) {
			case 'api': //api
				api.onRequest(request, parsedUrl, function (error, data) {
					returnRequest(result, error, data);
				});
				break;
			case 'files': //files api
				// console.log("files api call");
				filesmanager.onFilesApiRequest(parsedUrl, function (error, data) {
					returnRequest(result, error, data);
				});
				break;
			default: //file manager path
				filesmanager.onWebRequest(parsedUrl, function (error, data) {
					returnRequest(result, error, data);
				});
				break;
		}
	}

	function onRequestStart(req, res) {
		//method based on this article https://itnext.io/how-to-handle-the-post-request-body-in-node-js-without-using-a-framework-cd2038b93190
		//fixed with this: https://stackoverflow.com/a/45160600
		if (req.method === 'POST') {
			req.body = false;
			var bodyArrayBuffer = [];
			req.on('data', function (chunk) {
				bodyArrayBuffer.push(chunk); //push buffer to arrayBuffer
			});
			req.on('end', function (evt) {
				req.body = Buffer.concat(bodyArrayBuffer);
				onRequest(req, res);
			});
		} else {
			//if GET, no body
			onRequest(req, res);
		}
	}

	//returns response to client
	function returnRequest(res, error, params) {
		/*
		data:{
			mimeType: string
			data: any
		}
		*/
		if (error) {
			console.log("ERROR", error);
			res.statusCode = (error.errorCode || 500);
			//displays error message
			var endstring = "<h1>Erreur " + res.statusCode + "</h1><br/>";
			if (error.clientMsg) {
				endstring += error.clientMsg;
			} else {
				endstring += "internal server error";
			}
			res.end(endstring);
			return;
		}
		if (params.mimeType) {
			res.setHeader("Content-Type", params.mimeType);
		}
		res.statusCode = 200;
		res.end(params.data); //returns
	}

	return {httpServer, httpsServer}
}

module.exports = { startServer: startServer };