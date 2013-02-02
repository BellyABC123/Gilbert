var getViewObject = function(json) {
	return JSON.parse(json.replace(/(\r\n|\n|\r)/gm,""));
}

var handleViewObject = function(obj) {
	var keys = Object.keys(obj);
}

var sample = {
	"MCNavigationView" : {
		"chefmatesLogo" : {
			"class" : "UIButton",
			"atomic" : "nonatomic",
			"memory" : "strong", 
			"position" : "center",
			"top" : 15,
			"bottom" : 15,
			"backgroundColor" : "clear",
			"font" : "Lobster 1.4",
			"fontSize" : 42,
			"textColor" : "white",
			"text" : "Chefmates",
			"shadowColor" : "black",
			"shadowOffset" : "3,3",
			"textAlignment" : "center",
		},
		"pantryButton" : {
			"class" : "UIButton",
			"atomic" : "nonatomic",
			"memory" : "strong", 
			"position" : "center",
			"top" : 15,
			"bottom" : 15,
			"backgroundColor" : "clear",
			"font" : "Lobster 1.4",
			"fontSize" : 24,
			"textColor" : "white",
			"text" : "My Pantry",
			"shadowColor" : "black",
			"shadowOffset" : "2,2",
			"textAlignment" : "center",
		}
	}
}
console.log(sample);
//console.log(getViewObject(sample));