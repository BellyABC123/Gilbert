function stopDemHaterz() {
	$("#editor").css("height", $(window).height()*.65);
	$("#editor").css("width", $(window).width() - 400);
	$("#mobileView").css("height", $(window).height()-40);
	$("#output").css("height", $(window).height()*.30);
	$("#output").css("width", $(window).width() - 400);
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
