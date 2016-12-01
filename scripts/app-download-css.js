$(function() {

	$("#download-theme").click(function() {
		// HACK - need to temporarily (I hope) show code examples for segmented bar and tabview
		$("#segmented-example").text("<SegmentedBar selectedBackgroundColor='" + $("#ios-seg-bar").spectrum("get") +"'>");
		$("#tabview-example").text("<TabView selectedColor='" + $("#tab-label-text-color").spectrum("get") +"' tabsBackgroundColor='" + $("#tab-bar-color").spectrum("get") +"'>");
		
		// open the download modal
		var inst = $("[data-remodal-id=loadDownloadModal]").remodal();
		inst.open();
	});

	// magical code to create and download a file on the client side
	$("#download-css").click(function() {

		var n = "%0D%0A"; // new line
		
		$.getJSON("scripts/data/relations.json", function(data){

			var css = "data:text/css;charset=UTF-8,/* generated by nativescriptthemebuilder.com */" + n + n;

			$.each(data, function (index, value) {
				
				var elementId = value.id;
				var element = $("#" + elementId);

				// get element class, this will tell us if it's a color picker or text input
				var elementClass = element.attr("class");

				var output = "";

				if (elementClass == "enable-cp") {
					output = element.spectrum("get");
				} else if (elementClass == "enable-txt") {
					output = element.val();
				}

				// loop through iframes
				$.each(value.iframe, function (index, valueIframe) {
					var iframe = valueIframe.id;
					// loop through tns css attributes
					$.each(value.tns, function (index, valueTns) {
						// exception (addition) for action bar text color, which is programmatically determined
						if (valueTns.class == ".action-bar") {
							css += valueTns.class + " {" + n + "color: " + idealTextColor(output) + ";" + n + "}" + n + n;
						}
						css += valueTns.class + " {" + n + valueTns.attr + ": " + output + ";" + n + "}" + n + n;
					});
				});

			});

			downloadURI(css, "custom.css");

		});
	});

});

function downloadURI(uri, name) {
	var link = document.createElement("a");
	link.download = name;
	link.href = uri;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	delete link;
}