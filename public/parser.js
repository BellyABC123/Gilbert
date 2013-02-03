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
			return "NSTextAlignmentCenter";
			break;
		case "right":
			return "NSTextAlignmentRight";
			break;
		case "justify":
			return "NSTextAlignmentJustified";
			break;
		default:
			return "NSTextAlignmentLeft";
			break;
	}
}

function NSStringFromText(text) {
	if (!text) return undefined;
	return "@\"" + text + "\"";
}

function parsePropertyValue(value) {
	if (typeof(value) === 'boolean'){
		if (value) return "YES;";
		return "NO;";
	} else if (typeof(value) === typeof("String")) {
		return NSStringFromText(value) + ";";
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
	return type + " *" + key + " = [[" + type + " " + alloc + frame + "];\n";
}

function fontText(key, font, size) {
	if (!key || !font || !size) return undefined;
	return "UIFont *" + key + "Font = [UIFont fontWithName:" + NSStringFromText(font) + " size:" + size + "];";
}

function textColorText(key, color) {
	return key + ".textColor" + " = " + iosColors(color) + ";";
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
	return key + ".text = " + NSStringFromText(text) + ";";
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

function getTextSize(key, view) {
	if (!view.text) return undefined;
	return "CGSize " + key + "Size = [" + NSStringFromText(view.text) + " sizeWithFont:" + key + "Font];";
}

function getRectForView(key, view) {
	if (!view.relativeTo) return undefined;
	var sizeVar = key + "Size";
	padding = "0";
	var rectString = "CGRect " + key + "Rect = CGRectMake("; 
	if (view.padding) padding = view.padding;
	if (view.relativeTo === "window") {
		switch(view.align) {
			case "center":
				rectString += "screenRect.width / 2 - " + sizeVar + ".width / 2,";
				rectString += padding + ","
				rectString += sizeVar + ".width, " + sizeVar + ".height);";
				break;
			case "left":
				break;
			case "right":
				break;
			default:
				break;
		}
	}
	view.frame = key + "Rect";
	return rectString;
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

function setViewAlignment(view) {
	if (!view.align)
		view.align = "left";
}

function addAllTheThings(key, view) {
	var stuff = [];
	console.log(view);

	setViewAlignment(view);

	stuff.push(getTextSize(key, view));
	stuff.push(getRectForView(key, view));
	stuff.push(allocText(key, getClass(view.class), allocTextString(view.class), view.frame));
	stuff.push(fontText(key, view.font, view.fontSize));
	stuff.push(backgroundColorText(key, view.backgroundColor));
	stuff.push(textColorText(key, view.textColor));
	stuff.push(textAlignmentText(key, view.textAlignment));
	stuff.push(textStringText(key, view.text));
	stuff.push(borderColorText(key, view.borderColor));
	stuff.push(borderWidthText(key, view.borderWidth));
	stuff.push(handleProperties(key, view.properties, view));
	stuff.push(addSubviewText(key));
	stuff.push("\n");
	return filter(stuff);
}

function setupDocument(doc) {
	doc.push(["CGRect screenRect = [[UIScreen mainScreen] bounds];\n"]);
}

var handleSubview = function(key, subview) {
	finalOutput.push(addAllTheThings(key, subview));
}

parseCurrent = function() {
	var lines = editor.getValue();
	try {
		var obj = getViewObject(lines);
	} catch(err) {
		return;
	}
	output.setValue("");
	var viewKeys = Object.keys(obj);
	$(document).ready(function(){
		var ios = $("#iosout");
		var finalString = "";
		finalOutput = [];
		setupDocument(finalOutput);
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
		output.setValue(" ");
		output.setValue(finalString);
	});
}