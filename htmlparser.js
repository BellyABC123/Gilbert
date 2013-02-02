var getViewObject = function(json) {
    return JSON.parse(json.replace(/(\r\n|\n|\r)/gm,""));
}

var handleObjects = function(key, obj) {
    var parseOut = [];
    parseOut.push("<html>", "<style>");
    parseOut.push("." + key + "{", "font: " + obj.fontSize + "px/" + obj.fontSize + "px '" + obj.font + "';");
    parseOut.push("</style>", "</html>");

    output.setValue(parseOut.join("\n"));
}

var handleSubview = function(key, subview) {
    var cls = subview["class"];
    handleObjects(key, subview);
}

var parseCurrent = function() {
    var lines = editor.getValue();
    var obj = getViewObject(lines)["MCNavigationView"];
    $(document).ready(function() {
        var html = $("#htmlout");
        var keys = Object.keys(obj);
        keys.forEach(function(k) {
            handleSubview(k, obj[k]);
        });
    });
}

parseCurrent();
