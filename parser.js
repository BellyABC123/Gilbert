var getViewObject = function(json) {
	return JSON.parse(json.replace(/(\r\n|\n|\r)/gm,""));
}

var validiOSColors = ["black","darkGray","lightGray","white","gray",
					  "red","green","blue","cyan","yellow","magenta",
					  "orange","purple","brown","clear"];

var iosColors = function(color) {
	if (validiOSColors.indexOf(color) >= 0) {
		return "[UIColor " + color + "Color];";
	}
}

var handleButton = function(key, button) {
	var buttonOut = [];
	buttonOut.push("UIButton *" + key + " = [UIButton buttonWithType:UIButtonTypeCustom];\n");
	if (button.backgroundColor)
		buttonOut.push(key + ".backgroundColor = " + iosColors(button.backgroundColor));
	

	output.setValue(buttonOut.join("\n"));
}

var handleLabel = function(key, label) {

}

var handleSubview = function(key, subview) {
	if (subview["class"] === undefined) return;
	var cls = subview["class"];
	switch (cls) {
		case "button":
			handleButton(key, subview);
			break;
		case "label":
			handleLabel(key, subview);
			break;
		default:
			console.log("Unknown class: ", subview["class"]);
			break;
	}
}

var parseCurrent = function() {
	var lines = editor.getValue();
	var obj = getViewObject(lines)["MCNavigationView"];
	$(document).ready(function(){
		var ios = $("#iosout");
		var keys = Object.keys(obj);
		keys.forEach(function(k) {
			handleSubview(k, obj[k]);
		});
	});
}

parseCurrent();