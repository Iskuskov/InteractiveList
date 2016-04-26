var WebSocketServer = new require('ws');

var clients = {};
var data = {};

var webSocketServer = new WebSocketServer.Server({
	port: 8081
});
webSocketServer.on('connection', function(ws) {

	var clientId = Math.random();
	clients[clientId] = ws;
	console.log("New connection " + clientId);

	for (var index in data) {
		ws.send(JSON.stringify({id: index, text: data[index]}));
	}
	
	ws.on('message', function(message) {
		console.log('Receive message ' + message);

		index = new Date().getTime();
		data[index] = message;
		
		for (var key in clients) {
			clients[key].send(JSON.stringify({id: index, text: message}));
		}
	});

	ws.on('close', function() {
		console.log('Close connection ' + clientId);
		delete clients[clientId];
	});
});