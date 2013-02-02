var finalOutput = [];

var getViewObject = function(json) {
	return JSON.parse(json.replace(/(\r\n|\n|\r)/gm,""));
}

var validiOSColors = ["black","darkGray","lightGray","white","gray",
					  "red","green","blue","cyan","yellow","magenta",
					  "orange","purple","brown","clear"];

var classes = {
	"label" : "UILabel",
	"button" : "UIButton",
	"view" : "UIView",
	"scrollView" : "UIScrollView",
}

function getClass(type) {
	if (classes[type] !== undefined)
		return classes[type];
	return type;
}

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

function NSStringFromText(text) {
	if (!text) return undefined;
	return "@\"" + text + "\";";
}

function parsePropertyValue(value) {
	if (typeof(value) === 'boolean'){
		if (value) return "YES;";
		return "NO;";
	} else if (typeof(value) === typeof("String")) {
		return NSStringFromText(value);
	} else if (typeof(value) === typeof(1)) {
		return "" + value + ";";
	}
}

function setPropertyText(key, property, value) {
	if (!key || !property || !value) return undefined;
	return key + "." + property + " = " + parsePropertyValue(value);
}

function handleProperties(key, props, view) {
	if (!key || !props || !view) return;
	propString = "";
	props.forEach(function(p) {
		var settingString = setPropertyText(key, p, view[p]);
		if (settingString !== undefined) 
			propString += settingString + "\n";
	});
	return propString;
}

function allocText(key, type, alloc, frame) {
	if (!frame) 
		return type + " *" + key + " = [" + type + " " + alloc + ";\n";
	return type + " *" + key + " = [[" + type + " " + alloc + "] " + "initWithFrame: " + frame + "];\n";
}

function fontText(key, font, size) {
	if (!key || !font || !size) return undefined;
	return "UIFont *" + key + "Font = [UIFont fontWithName: " + font + " size: " + size + "];";
}

function backgroundColorText(key, color) {
	if (!key || !color) return undefined;
	return key + ".backgroundColor = " + iosColors(color) + ";";
}

function textAlignmentText(key, align) {
	if (!key || !align) return undefined;
	return key + ".textAlignment = " + iosTextAlignment(align) + ";";
}

function textStringText(key, text) {
	if (!key || !text) return undefined;
	return key + ".text = " + NSStringFromText(text);
}

function borderColorText(key, color) {
	if (!key || !color) return undefined;
	return key + ".layer.borderColor = " + "[" + iosColors(color) + " CGColor];";
}

function borderWidthText(key, width) {
	if (!key || !width) return undefined;
	return key + ".layer.borderWidth = " + width + ";";
}

function addSubviewText(key) {
	if (!key) return undefined;
	return "[self addSubview:" + key + "];";
}

function filter(arr) {
	var temp = [];
	arr.forEach(function(obj) {
		if (obj !== undefined)
			temp.push(obj);
	});
	return temp;
}

function allocTextString(type) {
	switch(type) {
		case "button":
			return "buttonWithType:UIButtonTypeCustom";
			break;
		default:
			return "alloc] initWithFrame:";
			break;
	}
}

function addAllTheThings(key, view) {
	var stuff = [];
	console.log(view);
	stuff.push(allocText(key, getClass(view.class), allocTextString(view.class), view.frame));
	stuff.push(fontText(key, view.font, view.fontSize));
	stuff.push(backgroundColorText(key, view.backgroundColor));
	stuff.push(textAlignmentText(key, view.textAlignment));
	stuff.push(textStringText(key, view.text));
	stuff.push(borderColorText(key, view.borderColor));
	stuff.push(borderWidthText(key, view.borderWidth));
	stuff.push(handleProperties(key, view.properties, view));
	stuff.push(addSubviewText(key));
	stuff.push("\n");
	return filter(stuff);
}


var handleSubview = function(key, subview) {
	finalOutput.push(addAllTheThings(key, subview));
}

parseCurrent = function() {
	var lines = editor.getValue();
	var obj = getViewObject(lines);
	var viewKeys = Object.keys(obj);
	$(document).ready(function(){
		var ios = $("#iosout");
		var finalString = "";
		viewKeys.forEach(function(v) {
			var currentView = obj[v];
			var keys = Object.keys(currentView);
			keys.forEach(function(k) {
				handleSubview(k, currentView[k]);
			});
			finalOutput.forEach(function(o){
				finalString += o.join("\n");
			});
		});
		output.setValue(finalString);
	});
}