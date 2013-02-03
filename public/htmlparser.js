var finalOutput = [];

var getViewObject = function(json) {
    return JSON.parse(json.replace(/(\r\n|\n|\r)/gm,""));
}

function setFont(key, obj) {
    if (!key || !obj || !obj.font || !obj.fontSize) 
        return undefined;
    var fontFamily = "font: " + obj.fontSize + "px/" +
            obj.fontSize + "px '" + obj.font + "';";
    return fontFamily;
}

function setTextAlign(key, align) {
    if (!key || !align) return undefined;
    return "text-align: " + align + ";";
}

function setColor(key, color) {
    if (!key || !color)
        return undefined;
    return "color: " + color + ";";
}

function setBackground(key, obj) {
    if (!key || !obj)
        return undefined;
    if (obj.backgroundColor.indexOf("clear") !== -1) {
        var bgColor = "background: transparent";
    }
    else {
        var bgColor = "background: " + obj.backgroundColor;
    }
    if (obj.backgroundImage) {
        var bgUrl = " url('" + obj.backgroundImage + "')";
        if (obj.backgroundRepeat) {
            switch(obj.backgroundRepeat.toLowerCase()) {
                case "x":
                    return bgColor + bgUrl + " repeat-x;";
                case "y":
                    return bgColor + bgUrl + " repeat-y;";
                case "none":
                    return bgColor + bgUrl + " no-repeat;";
                default:
                    return bgColor + bgUrl + ";";
            }
        }
        else {
            return bgColor + bgUrl + ";";
        }
    }
    return bgColor + ";";
}

function setWidth(key, width) {
    if (!key || !width) return undefined;
    return "width: " + width + ";";
}

function setHeight(key, height) {
    if (!key || !height) return undefined;
    return "height: " + height + ";";
}

function alignObj(key, pos) {
    if (!key || !pos) return undefined;
    switch(pos) {
        case "center":
            return "margin: 0 auto;";
        case "right":
            return "float: right;\n overflow: auto;";
        case "left":
            return "float: left;\n overflow: auto;";
        default:
            return;
    }
}

function setPadding(key, obj) {
    if (!key || !obj || !obj.padding) return undefined;
    if (obj.padding) {
        return "padding: " + obj.padding + ";";
    }
    else if (obj.topPadding && obj.rightPadding && obj.bottomPadding && obj.leftPadding) {
        return "padding: " + obj.topPadding + " " + obj.rightPadding + " " + 
                obj.bottomPadding + " " + obj.leftPadding + ";";
    }
}

function setMargin(key, obj) {
    if (!key || !obj || !obj.margin) return undefined;
    if (obj.margin) {
        return "margin: " + obj.margin + ";";
    }
    else if (obj.topMargin && obj.rightMargin && obj.bottomMargin && obj.leftMargin) {
        return "margin: " + obj.topMargin + " " + obj.rightMargin + " " + 
                obj.bottomMargin + " " + obj.leftMargin + ";";
    }
}

//css requires minimum color and offset
function setBoxShadow(key, obj) {
    if (!key || !obj || !obj.boxShadowColor || !obj.boxShadowOffset) return undefined;
    var shadowColor = obj.boxShadowColor + ";\n";
   
    var moz = "-moz-box-shadow: " + obj.boxShadowOffset[0] + "px " + obj.boxShadowOffset[2] + "px ";
    var webkit = "-webkit-box-shadow: " + obj.boxShadowOffset[0] + "px " + obj.boxShadowOffset[2] + "px ";
    var box = "box-shadow: " + obj.boxShadowOffset[0] + "px " + obj.boxShadowOffset[2] + "px ";
    if (obj.boxShadowBlur) {
        var blur = obj.boxShadowBlur + "px ";
        return (moz + blur + shadowColor) + (webkit + blur + shadowColor) + (box + blur + shadowColor);
    }
    else {
        return (moz + shadowColor) + (webkit + shadowColor) + (box + shadowColor);
    }
}

function setTextShadow(key, obj) {
    if (!key || !obj.textShadowColor || !obj.textShadowOffset) return undefined;
    return "text-shadow: " + obj.textShadowOffset[0] +  "px " + obj.textShadowOffset[2] + "px " + obj.textShadowColor + ";";
}

function makeItem(key, obj) {
    if (!key || !obj | !obj.text) return undefined;
    return "<div class=\"" + key + "\">" + obj.text + "</div>\n";
}

function filterUndefined(arr) {
    var temp = [];
    arr.forEach(function(obj) {
        if (obj !== undefined)
            temp.push(obj);
    });
    return temp;
}

function pushStyle(key, view) {
    var tuco = [];
    console.log(view);
    if (key.indexOf("body") !== -1) {
        tuco.push(key + " {");
    }
    else {
        tuco.push("." + key + " {");
    }
    tuco.push(setBackground(key, view));
    tuco.push(setWidth(key, view.width));
    tuco.push(setHeight(key, view.height));
    tuco.push(setFont(key, view));
    tuco.push(setColor(key, view.textColor));
    tuco.push(setTextAlign(key, view.textAlignment));
    tuco.push(alignObj(key, view.position));
    tuco.push(setPadding(key, view));
    tuco.push(setMargin(key, view));
    tuco.push(setBoxShadow(key, view));
    tuco.push(setTextShadow(key, view));
    tuco.push("}\n");
    return filterUndefined(tuco);
}

function pushBody(key, view) {
    var heisenberg = [];
    heisenberg.push(makeItem(key, view));
    return filterUndefined(heisenberg);
}

var handleStyle = function(key, subview) {
    firstOutput.push(pushStyle(key, subview));
}

var handleBody = function(key, subview) {
    lastOutput.push(pushBody(key, subview));
}

var headings = ["<html>\n<head>\n<style type=\"text/css\">\n"];
var middle = ["</style>\n</head>\n<body>\n"];
var endings = ["</body>\n</html>"];

console.log(headings);
parseHTMLCurrent = function() {
	var lines = editor.getValue();
    try {
    	var obj = getViewObject(lines);
    } catch(err) {
        return;
    }
	var viewKeys = Object.keys(obj);

    $(document).ready(function() {
        var html = $("#htmlout");
        var finalString = "";
        firstOutput = [];
        lastOutput = [];
        finalOutput = [];
        viewKeys.forEach(function(v) {
            var currentView = obj[v];
            var keys = Object.keys(currentView);
            keys.forEach(function(k) {
                handleStyle(k, currentView[k]);
                handleBody(k, currentView[k]);
            });
            console.log(firstOutput);
            console.log(lastOutput); 
        });
        
        finalString += headings;
        
        firstOutput.forEach(function(o) {
            finalString += o.join("\n");
        });
        
        finalString += middle;
        
        lastOutput.forEach(function(o) {
            finalString += o.join("\n");
        });
        
        finalString += endings;
        
        htmlout.setValue("");
        htmlout.setValue(finalString);
    });
}
