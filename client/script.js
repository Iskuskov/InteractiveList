var addElement = function(index, text) {
	var parent = $("#list");
	var wrapper = $("<li />", {
		"id" : index,
		"text" : text,
		"class" : "list"
	}).appendTo(parent);
};

var moveElement = function(startPos, stopPos) {
	var startLi = $("#list li:eq(" + startPos + ")");
	var stopLi = $("#list li:eq(" + stopPos + ")");
	
	if (startPos < stopPos) {
		startLi.insertAfter(stopLi);
	} else {
		startLi.insertBefore(stopLi);
	}
};

$(document).on('ready', function() {

	var socket = new WebSocket("ws://localhost:8081");

	socket.onmessage = function(event) {
		var message = JSON.parse(event.data);
		var action = message.action;
		
		if (action == "add") {
			addElement(message.data.id, message.data.text);
		} else if (action == "move") {
			moveElement(message.data.start, message.data.stop);
		}
	};
	
	$("form").on("submit", function(e) {
		e.preventDefault();
		var text = $("#adding-input").val();
		if (text.length == 0) return;
		$("#adding-input").val('');
		socket.send(JSON.stringify({action: "add", data: text}));
	});
	
	$('#list').sortable({
		revert: true,
		placeholder: "highlight",
		start: function (event, ui) {
			ui.item.toggleClass("highlight");
			
			var start_pos = ui.item.index();
            ui.item.data('start_pos', start_pos);
		},
		stop: function (event, ui) {
			ui.item.toggleClass("highlight");
			
			var start_pos = ui.item.data('start_pos');
			var stop_pos = ui.item.index();
			if (start_pos != stop_pos) {
				var sendData = {start: start_pos, stop: stop_pos};
				socket.send(JSON.stringify({action: "move", data: sendData}));
			}
		}
	});
});