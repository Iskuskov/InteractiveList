var WebSocketServer = new require('ws');

var clients = {};
var data = {};
var order = [];

function moveElementInArray(array, oldIndex, newIndex) {
	var arrayClone = array.slice();
	arrayClone.splice(oldIndex, 1);
	arrayClone.splice(newIndex, 0, array[oldIndex]);
    return arrayClone
}

var webSocketServer = new WebSocketServer.Server({
	port: 8081
});
webSocketServer.on('connection', function(ws) {

	var clientId = Math.random();
	clients[clientId] = ws;
	console.log("New connection " + clientId);

	for (var i in order) {
		var index = order[i];
		var sendData = {id: index, text: data[index]};
		ws.send(JSON.stringify({action: "add", data: sendData}));
	}
	
	ws.on('message', function(message) {
		console.log('Receive message ' + message);

		var message = JSON.parse(message);
		var action = message.action;
		
		if (action == "add") {
			var index = new Date().getTime();
			var text = message.data;
			
			data[index] = text;
			order.push(index);
			
			for (var key in clients) {
				var sendData = {id: index, text: text};
				clients[key].send(JSON.stringify({action: "add", data: sendData}));
			}
		} else if (action == "move") {
			
			order = moveElementInArray(order, message.data.start, message.data.stop);
			
			for (var key in clients) {
				if (key != clientId) {
					clients[key].send(JSON.stringify({action: "move", data: message.data}));
				}
			}
		}
	});

	ws.on('close', function() {
		console.log('Close connection ' + clientId);
		delete clients[clientId];
	});
});