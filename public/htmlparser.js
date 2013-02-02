var getViewObject = function(json) {
    return JSON.parse(json.replace(/(\r\n|\n|\r)/gm,""));
}

var handleButton = function(key, button) {
    var buttonOut = [];
    buttonOut.push("font: " + button.fontSize + "px/" + button.fontSize + "px '" + button.font + "';");

    output.setValue(buttonOut.join("\n"));
}

var handleSubview = function(key, subview) {
    var cls = subview["class"];
    handleButton(key, subview);
}

var parseCurrent = function() {
    var lines = editor.getValue();
    var obj = getViewObject(lines)["MCNagivationView"];
    $(document).ready(function() {
        var html = $("#htmlout");
        var keys = Object.keys(obj);
        keys.forEach(function(k) {
            handleSubview(k, obj[k]);
        });
    });
}

parseCurrent();
