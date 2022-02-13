$(document).ready(function () {
	$("#radio-single").click(function () {
        $(".text-transaction").html(
            "<p class='text-transaction'><a onclick='window.location.href=this'>Clear |</a></p>"
        );

        $("#execute-button").show();

        $("#generate-button").hide();

        $("#query-form").html(
            "<textarea id='single-query' placeholder='Type query here...'></textarea>"
        );
	});
});