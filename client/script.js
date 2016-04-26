var generateElement = function(index, text) {
	var parent = $("#list");
	var wrapper = $("<li />", {
		"id" : index,
		"text" : text
	}).appendTo(parent);
};

$(document).on('ready', function() {

	var socket = new WebSocket("ws://localhost:8081");

	socket.onmessage = function(event) {
		var message = JSON.parse(event.data);
		generateElement(message.id, message.text);
	};

	$("form").on("submit", function(e) {
		e.preventDefault();
		var text = $("#adding-input").val();
		if (text.length == 0) return;
		$("#adding-input").val('');
		socket.send(text);
	})
});

