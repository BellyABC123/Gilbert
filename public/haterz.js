
function stopDemHaterz() {
	$("#editor").css("height", $(window).height()*.97);
	$("#output").css("height", $(window).height()*.97);
	$("#toggle-output").click(function(){
	    if ($("#htmlout").is(":visible")) {
	        $("#htmlout").hide();
	        $("#iosout").show();
	    }
	    else {
	        $("#iosout").hide();
	        $("#htmlout").show();
	    }
	  });
}

