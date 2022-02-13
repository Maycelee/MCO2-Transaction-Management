$(document).ready(function () {
	$("#radio-single").click(function () {
        /**if ($("#radio-multi").is(':checked')) {
            $("#query-form").html("");
            
            $("#search-button").show();
        }*/

        $("#query-form").html(
            "<textarea></textarea>"
        );
        
        $("#search-button").show();
	});
    
    $("#radio-multi").click(function () {
        $("#query-form").html(
            "<textarea></textarea><textarea></textarea>"
        );
        
        $("#search-button").show();
	});
});