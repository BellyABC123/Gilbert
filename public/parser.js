var getViewObject = function(json) {
	return JSON.parse(json.replace(/(\r\n|\n|\r)/gm,""));
}

var validiOSColors = ["black","darkGray","lightGray","white","gray",
					  "red","green","blue","cyan","yellow","magenta",
					  "orange","purple","brown","clear"];

var iosColors = function(color) {
	if (validiOSColors.indexOf(color) >= 0) {
		return "[UIColor " + color + "Color]";
	}
}

var iosTextAlignment = function(align) {
	switch(align) {
		case "center":
			return "NSTextAlignmentCenter;";
			break;
		case "right":
			return "NSTextAlignmentRight;";
			break;
		case "justify":
			return "NSTextAlignmentJustified;";
			break;
		default:
			return "NSTextAlignmentLeft";
			break;
	}
}

var handleButton = function(key, button) {
	var buttonOut = [];
	buttonOut.push("UIButton *" + key + " = [UIButton buttonWithType:UIButtonTypeCustom];\n");
	if (button.font && button.fontSize)
		buttonOut.push("UIFont *" + key + "Font = [UIFont fontWithName: " + button.font + " size: " + button.fontSize + "];");
	if (button.backgroundColor)
		buttonOut.push(key + ".backgroundColor = " + iosColors(button.backgroundColor) + ";");
	if (button.textAlignment)
		buttonOut.push(key + ".textAlignment = " + iosTextAlignment(button.textAlignment));
	if (button.text)
		buttonOut.push(key + ".text = @\"" + button.text + "\";");
	if (button.borderColor)
		buttonOut.push(key + ".layer.borderColor = " + "[" + iosColors(button.borderColor) + "CGColor];");
	if (button.borderWidth)
		buttonOut.push(key + ".layer.borderWidth = " + button.borderWidth);

	buttonOut.push("[self addSubview:" + key + "];");
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