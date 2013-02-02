$("#editor").css("height", $(window).height()*.65);
$("#canvas").css("height", $(window).height()-40);
$("#output").css("height", $(window).height()*.30);
$("#output").css("margin-top", $(window).height()*.65);

$("#toggle-output").click(function(){
    if ($("#htmlout").is(":visible")) {
        $("#htmlout").hide();
        $("#iosout").show();
    }
    else {
        $("#iosout").hide();
        $("#htmlout").show();
    }
    //$("#htmlout", "iosout").toggle();
});
