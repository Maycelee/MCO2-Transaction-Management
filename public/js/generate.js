$(document).ready(function () {
	$("#generate-button").click(function () {
        $("#query-form").submit();
    });
    $("#execute-button").click(function () {
        var node1_val = $("#node1-query").val();
        var node2_val = $("#node2-query").val();
        var node3_val = $("#node3-query").val();
        
        if(node1_val == "" && node2_val =="" && node3_val == ""){
            alert("All fields cannot be empty. Fill at least one.");
        } else {
            $("#query-form").submit();
        }
            
        
        
        
        
        
        
        
        
        
    });

});