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
    if (!key || !color) return undefined;
    return "color: " + color + ";";
}

function setBackground(key, bg) {
    if (!key || !bg) return undefined;
    switch(bg) {
        case "clear":
            return "background: transparent;";
        default:
            return "background: " + bg + ";";
    }
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

function setPadding(key, padding) {
    if (!key || !padding) return undefined;
    return "padding: " + padding + "px;";
}

function setMargin(key, obj) {
    if (obj.topMargin && obj.rightMargin && obj.bottomMargin && obj.leftMargin) {
        return "margin: " + obj.topMargin + "px " + obj.rightMargin + "px " + obj.bottomMargin + "px " + obj.leftMargin + "px;";
    }
}

function makeItem(key, obj) {
    if (!key || !obj | !obj.text) return undefined;
    return "<div class=\"." + key + "\">" + obj.text + "</div>\n";
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
    tuco.push("." + key + " {");
    tuco.push(setBackground(key, view.backgroundColor));
    tuco.push(setFont(key, view));
    tuco.push(setColor(key, view.textColor));
    tuco.push(setTextAlign(key, view.textAlignment));
    tuco.push(alignObj(key, view.position));
    tuco.push(setPadding(key, view.padding));
    tuco.push(setMargin(key, view));
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
parseCurrent = function() {
	var lines = editor.getValue();
	var obj = getViewObject(lines);
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
        
        output.setValue(" ");
        output.setValue(finalString);
    });
}
