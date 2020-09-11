const httpListener = require("./http_server/listener");
const websocketListener = require("./websocket_server/listener");
var {httpServer, httpsServer} = httpListener.startServer();
var {wsServer, wssServer} = websocketListener.startServer({httpServer, httpsServer});