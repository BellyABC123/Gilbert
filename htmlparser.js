var finalOutput = [];

var getViewObject = function(json) {
    return JSON.parse(json.replace(/(\r\n|\n|\r)/gm,""));
}

function setFont(key, obj) {
    if (!key || !obj) return undefined;
    var fontFamily = "font: " + obj.fontSize + "px/" +
            obj.fontSize + "px '" + obj.font + "';\n";
    var color = "color: " + obj.textColor + ";\n";
    var textAlign = "text-align: " + obj.textAlign + ";\n";

    return fontFamily + color + textAlign;
}

function alignObj(key, pos) {
    if (!key || !pos) return undefined;
    switch(pos) {
        case "center":
            return "margin: 0 auto;\n";
        case "right":
            return "float: right;\n overflow: auto;\n";
        case "left":
            return "float: left;\n overflow: auto;\n";
        default:
            return;
    }
}

function makeItem(key, obj) {
    if (!key || !obj) return undefined;
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
    tuco.push(setFont(key, view));
    tuco.push(alignObj(key, view.position));
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

var handleObjects = function(key, subview) {
    finalOutput.push(pushStuff(key, subview));
}

var headings = "<html>\n<head>\n<style type=\"text/css\">\n";
var middle = "</style>\n</head>\n<body>\n";
var endings = "</body>\n</html>";

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
            finalOutput.push(headings);
            finalOutput.push(firstOutput);
            finalOutput.push(middle);
            finalOutput.push(lastOutput);
            finalOutput.push(endings);

            finalOutput.forEach(function(o) {
                finalString += o.join("\n");
            });
        output.setValue(" ");
        output.setValue(finalString);
    });
}
