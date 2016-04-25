var data = JSON.parse(localStorage.getItem("listData")) || {};

var generateElement = function(index, text) {
	var parent = $("#list");
	var wrapper = $("<li />", {
		"id" : index,
		"text" : text
	}).appendTo(parent);
};

$(document).on('ready', function() {

	$.each(data, function (index, text) {
		generateElement(index, text);
	});

	$("form").on("submit", function(e) {
		e.preventDefault();
		var text = $("#adding-input").val();
		if (text.length == 0) {
			return;
		}
		id = new Date().getTime();
		generateElement(id, text);
		
		data[id] = text;
        localStorage.setItem("listData", JSON.stringify(data));
		
		$("#adding-input").val('');
	})


	
});

