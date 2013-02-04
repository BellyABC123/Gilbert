
function stopDemHaterz() {
	$("#editor").css("height", $(window).height()*.90);
	$("#output").css("height", $(window).height()*.90);
    $("#htmlout").css("height", $(window).height()*.90);
	$("#toggle-output").click(function(){
	    if ($("#htmlout").is(":visible")) {
	        console.log("htmlvisible");
            $("#htmlout").hide();
	        $("#output").show();
	    }
	    else {
            console.log("iosvisible");
	        $("#output").hide();
	        $("#htmlout").show();
	    }
	    parseCurrent();
        parseHTMLCurrent();
	  });
}

