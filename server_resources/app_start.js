const httpServer = require("./http_server/listener");
const websocketServer = require("./websocket_server/listener");
console.log("initiating servers start");
httpServer.startServer();
websocketServer.startServer();