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
	else if (type === "UIButton")
		return type + " *" + key + " = [" + type + " " + alloc + "];\n" + key + ".frame = " + frame + ";";
	return type + " *" + key + " = [[" + type + " " + alloc + frame + "];\n";
}

function fontText(key, font, size) {
	if (!key || !font || !size) return undefined;
	return "UIFont *" + key + "Font = [UIFont fontWithName:" + NSStringFromText(font) + " size:" + size + "];";
}

function textColorText(key, color, isButton) {
	if (!color) return undefined;
	if (isButton) 
		return key + ".titleLabel.textColor" + " = " + iosColors(color) + ";";
	return key + ".textColor" + " = " + iosColors(color) + ";";
}

function backgroundColorText(key, color) {
	if (!key || !color) return undefined;
	return key + ".backgroundColor = " + iosColors(color) + ";";
}

function textAlignmentText(key, align, isButton) {
	if (!key || !align) return undefined;
	if (isButton) 
		return key + ".titleLabel.textAlignment = " + iosTextAlignment(align) + ";";	
	return key + ".textAlignment = " + iosTextAlignment(align) + ";";
}

function textStringText(key, text, isButton) {
	if (!key || !text) return undefined;
	if (isButton)
		return key + ".titleLabel.text = " + NSStringFromText(text) + ";";
	return key + ".text = " + NSStringFromText(text) + ";";
}

function setFontText(key, hasFont, isButton) {
	if (!key || !hasFont) return undefined;
	if (isButton)
		return key + ".titleLabel.font = " + key + "Font" + ";";
	return key + ".font = " + key + "Font" + ";";
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
				rectString += "screenRect.size.width / 2 - " + sizeVar + ".width / 2,";
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

	stuff.push(fontText(key, view.font, view.fontSize));
	stuff.push(getTextSize(key, view));
	stuff.push(getRectForView(key, view));
	stuff.push(allocText(key, getClass(view.class), allocTextString(view.class), view.frame));
	stuff.push(backgroundColorText(key, view.backgroundColor));
	stuff.push(textColorText(key, view.textColor, view.class === "button"));
	stuff.push(textAlignmentText(key, view.textAlignment, view.class === "button"));
	stuff.push(textStringText(key, view.text, view.class === "button"));
	stuff.push(setFontText(key, (view.font !== undefined && view.fontSize !== undefined), (view.class === "button")));
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
	saveData();
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