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
	"textField" : "UITextField",
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

function hexToRgb(hex) {
	console.log(typeof(hex));
	console.log(hex);
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbText(hexVal) {
	return "[UIColor colorWithRed:" + hexVal.r + " green:" + hexVal.g + " blue:" + hexVal.b + " alpha:1.0]";
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
	if (!key || !type || !alloc || key === "self") return undefined;
	if (!frame) 
		return key + " = [" + type + " " + alloc + "];\n";
	else if (type === "UIButton")
		return key + " = [" + type + " " + alloc + "];\n" + key + ".frame = " + frame + ";";
	return key + " = [[" + type + " " + alloc + frame + "];\n";
}

function fontText(key, font, size) {
	if (!key || !font || !size) return undefined;
	return "UIFont *" + key + "Font = [UIFont fontWithName:" + NSStringFromText(font) + " size:" + size + "];";
}

function textColorText(key, color, isButton) {
	if (!color) return undefined;
	var colorText = iosColors(color);
	var hexVal = hexToRgb(color);
	if (hexVal)
		colorText = rgbText(hexVal);
	if (isButton) 
		return key + ".titleLabel.textColor" + " = " + colorText + ";";
	return key + ".textColor" + " = " + colorText + ";";
}

function backgroundColorText(key, color) {
	if (!key || !color) return undefined;
	var hexVal = hexToRgb(color);
	if (hexVal)
		return key + ".backgroundColor = " + rgbText(hexVal) + ";";
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
		return "[" + key + " setTitle:" + NSStringFromText(text) + " forState:UIControlStateNormal];";
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
	var hexVal = hexToRgb(color);
	if (hexVal)
		return key + ".layer.borderColor = " + rgbText(hexVal) + ";";
	return key + ".layer.borderColor = " + "[" + iosColors(color) + " CGColor];";
}

function backgroundImageText(key, image) {
	if (!key || !image) return undefined;
	return key + ".backgroundColor = [UIColor colorWithPatternImage:[UIImage imageNamed:" + NSStringFromText(image) + "]];";
}

function borderWidthText(key, width) {
	if (!key || !width) return undefined;
	return key + ".layer.borderWidth = " + width + ";";
}

function addSubviewText(key) {
	if (!key || key === "self") return undefined;
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
			return "buttonWithType:UIButtonTypeRoundedRect";
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
	stuff.push(backgroundImageText(key, view.backgroundImage));
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

function setupView(viewName, view, output) {
	var setup = [];
	setup.push("@interface " + viewName + " : " + "UIView" + "\n");
	var subviews = Object.keys(view);
	subviews.forEach(function(s){
		if (s !== "name" && s !== "self") {
			var sv = view[s];
			if (!sv.atomic)
				sv.atomic = "nonatomic";
			if (!sv.memory)
				sv.memory = "strong";
			setup.push("@property (" + sv.atomic + ", " + sv.memory + ") " + getClass(sv.class) + " *" + s + ";");
		}
	});
	setup.push("\n@end\n\n@implementation " + viewName + "\n");
	setup.push("CGRect screenRect = [[UIScreen mainScreen] bounds];\n");
	console.log(setup);
	output.push(setup);
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
		viewKeys.forEach(function(v) {
			var currentView = obj[v];
			setupView(v, currentView, finalOutput);
			var keys = Object.keys(currentView);
			keys.forEach(function(k) {
				handleSubview(k, currentView[k]);
			});
			finalOutput.forEach(function(o){
				finalString += o.join("\n");
			});
			finalString += "@end";
		});
		output.setValue(" ");
		output.setValue(finalString);
	});
}