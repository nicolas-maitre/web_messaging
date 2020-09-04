const httpServer = require("./http_server/listener");
const websocketServer = require("./websocket_server/listener");
httpServer.startServer();
websocketServer.startServer();