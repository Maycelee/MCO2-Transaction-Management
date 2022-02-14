$(document).ready(function () {
	$("#radio-multi").click(function () {
        $(".text-transaction").html(
            "<p class='text-transaction'><a onclick='window.location.href=this'>Back |</a></p>"
        );

        $("#execute-button").show();

        $("#generate-button").hide();
        
        $("#query-form").html(
            "<p class='text-node'>Node 1</p>" +
            "<textarea id='node1-query' placeholder='Node 1 query here...'></textarea>" +
            "<p class='text-node'>Node 2</p>" +
            "<textarea id='node2-query' placeholder='Node 2 query here...'></textarea>" +
            "<p class='text-node'>Node 3</p>" +
            "<textarea id='node3-query' placeholder='Node 3 query here...'></textarea>" +
            "<p class='text-node'>Isolation Level</p>" +
            "<select name='isolation' id='form-isolation'>" +
                "<option value='read-uncommitted'>Read Uncommitted</option>" +
                "<option value='read-committed'>Read Committed</option>" +
                "<option value='read-repeatable'>Read Repeatable</option>" +
                "<option value='serializable'>Serializable</option>" +
            "</select>"
        );
    });
});

