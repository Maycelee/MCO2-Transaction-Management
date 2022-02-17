$(document).ready(function () {
    //When Multiple Queries is Clicked
	$("#node1-crud").change(function() {
        var val = $(this).val();
        switch(val) {
            case 'empty':
                $("#node1-name").show();
                $("#node1-year").show();
                $("#node1-rank").show();
            
                $("#node1-name").attr("placeholder", "Name");
                $("#node1-year").attr("placeholder", "Year");
                $("#node1-rank").attr("placeholder", "Rank");
                break;
            case 'read':
                $("#node1-name").hide();
                $("#node1-year").hide();
                $("#node1-rank").hide();
                break;
            case 'delete':
                $("#node1-name").hide();
                $("#node1-year").hide();
                $("#node1-rank").hide();
                break;
            case 'update':
                $("#node1-name").show();
                $("#node1-year").show();
                $("#node1-rank").show();

                $("#node1-name").attr("placeholder", "New Name");
                $("#node1-year").attr("placeholder", "New Year");
                $("#node1-rank").attr("placeholder", "New Rank");
                break;
        }
    });

	$("#node2-crud").change(function() {
        var val = $(this).val();
        switch(val) {
            case 'empty':
                $("#node2-name").show();
                $("#node2-year").show();
                $("#node2-rank").show();
            
                $("#node2-name").attr("placeholder", "Name");
                $("#node2-year").attr("placeholder", "Year");
                $("#node2-rank").attr("placeholder", "Rank");
                break;
            case 'read':
                $("#node2-name").hide();
                $("#node2-year").hide();
                $("#node2-rank").hide();
                break;
            case 'delete':
                $("#node2-name").hide();
                $("#node2-year").hide();
                $("#node2-rank").hide();
                break;
            case 'update':
                $("#node2-name").show();
                $("#node2-year").show();
                $("#node2-rank").show();

                $("#node2-name").attr("placeholder", "New Name");
                $("#node2-year").attr("placeholder", "New Year");
                $("#node2-rank").attr("placeholder", "New Rank");
                break;
        }
    });

	$("#node3-crud").change(function() {
        var val = $(this).val();
        switch(val) {
            case 'empty':
                $("#node3-name").show();
                $("#node3-year").show();
                $("#node3-rank").show();
            
                $("#node3-name").attr("placeholder", "Name");
                $("#node3-year").attr("placeholder", "Year");
                $("#node3-rank").attr("placeholder", "Rank");
                break;
            case 'read':
                $("#node3-name").hide();
                $("#node3-year").hide();
                $("#node3-rank").hide();
                break;
            case 'delete':
                $("#node3-name").hide();
                $("#node3-year").hide();
                $("#node3-rank").hide();
                break;
            case 'update':
                $("#node3-name").show();
                $("#node3-year").show();
                $("#node3-rank").show();

                $("#node3-name").attr("placeholder", "New Name");
                $("#node3-year").attr("placeholder", "New Year");
                $("#node3-rank").attr("placeholder", "New Rank");
                break;
        }
    });

    $("#execute-button").click(function () {
        //Crud Dropdown
        var node1_crud = $("#node1-crud").val();
        var node2_crud = $("#node2-crud").val();
        var node3_crud = $("#node3-crud").val();
        //ID Textboxes
        var node1_id = $("#node1-id").val();
        var node2_id = $("#node2-id").val();
        var node3_id = $("#node3-id").val();
        //Name Textboxes
        var node1_name = $("#node1-name").val();
        var node2_name = $("#node2-name").val();
        var node3_name = $("#node3-name").val();
        //Year Textboxes
        var node1_year = $("#node1-year").val();
        var node2_year = $("#node2-year").val();
        var node3_year = $("#node3-year").val();
        //Rank Textboxes
        var node1_rank = $("#node1-rank").val();
        var node2_rank = $("#node2-rank").val();
        var node3_rank = $("#node3-rank").val();
        
        /*console.log("Node 1 Crud: " + node1_crud);
        console.log("Node 2 Crud: " + node2_crud);
        console.log("Node 3 Crud: " + node3_crud);
        console.log("");*/

        var nodepass = true;
        var readpass = true;
        var updatepass = true;
        var deletepass = true;

        //All Crud Dropdown is Empty
        if (node1_crud == "empty" && node2_crud == "empty" && node3_crud == "empty"){
            $("#alert-invalid").html("");
            $("#alert-invalid").append("<p class='text-node' style='color: #E60000;'>All fields cannot be empty. Fill at least one.</p>");
            $("#alert-invalid").show();
            nodepass = false;
        }
        //Read but Empty ID
        if (node1_crud == "read" || node2_crud == "read" || node3_crud == "read"){
            $("#alert-invalid").html("");
            //Node 1
            if (node1_crud == "read" && node1_id == "") {
                $("#alert-invalid").append("<p class='text-node' style='color: #E60000;'>Cannot READ in Node 1 when ID field is empty.</p>");
                readpass = false;
            } else if (node1_crud == "read" && node1_id != "") { readpass = true; }
            //Node 2
            if (node2_crud == "read" && node2_id == "") {
                $("#alert-invalid").append("<p class='text-node' style='color: #E60000;'>Cannot READ in Node 2 when ID field is empty.</p>");
                readpass = false;
            } else if (node2_crud == "read" && node2_id != "") { readpass = true; }
            //Node 3
            if (node3_crud == "read" && node3_id == "") {
                $("#alert-invalid").append("<p class='text-node' style='color: #E60000;'>Cannot READ in Node 3 when ID field is empty.</p>");
                readpass = false;
            } else if (node3_crud == "read" && node3_id != "") { readpass = true; }
            $("#alert-invalid").show();
        }
        //Update but Empty ID
        if (node1_crud == "update" || node2_crud == "update" || node3_crud == "update"){
            $("#alert-invalid").html("");
            //Node 1
            if (node1_crud == "update" && node1_id == "") {
                $("#alert-invalid").append("<p class='text-node' style='color: #E60000;'>Cannot UPDATE Node 1 when ID field is empty.</p>");
                updatepass = false;
            } else if (node1_crud == "update" && node1_id !="") {
                //Empty Name, Rank, Year values
                if (node1_name == "" && node1_year == "" && node1_rank == "") {
                    $("#alert-invalid").append("<p class='text-node' style='color: #E60000;'>Cannot UPDATE Node 1 when there are no new values.</p>");
                    updatepass = false;
                } else { updatepass = true; }
            }
            //Node 2
            if (node2_crud == "update" && node2_id == "") {
                $("#alert-invalid").append("<p class='text-node' style='color: #E60000;'>Cannot UPDATE Node 2 when ID field is empty.</p>");
                updatepass = false;
            } else if (node2_crud == "update" && node2_id != ""){
                //Empty Name, Rank, Year values
                if (node2_name == "" && node2_year == "" && node2_rank == "") {
                    $("#alert-invalid").append("<p class='text-node' style='color: #E60000;'>Cannot UPDATE Node 2 when there are no new values.</p>");
                    updatepass = false
                } else { updatepass = true; }
            }
            //Node 3
            if (node3_crud == "update" && node3_id == "") {
                $("#alert-invalid").append("<p class='text-node' style='color: #E60000;'>Cannot UPDATE Node 3 when ID field is empty.</p>");
                updatepass = false;
            } else if (node3_crud == "update" && node3_id != ""){
                //Empty Name, Rank, Year values
                if (node3_name == "" && node3_year == "" && node3_rank == "") {
                    $("#alert-invalid").append("<p class='text-node' style='color: #E60000;'>Cannot UPDATE Node 3 when there are no new values.</p>");
                    updatepass = false;
                } else { updatepass = true; }
            }
            $("#alert-invalid").show();
        }
        //Delete but Empty ID
        if (node1_crud == "delete" || node2_crud == "delete" || node3_crud == "delete") {
            $("#alert-invalid").html("");
            //Node 1
            if (node1_crud == "delete" && node1_id == "") {
                $("#alert-invalid").append("<p class='text-node' style='color: #E60000;'>Cannot DELETE in Node 1 when ID field is empty.</p>");
                deletepass = false;
            } else if (node1_crud == "delete" && node1_id != "") { deletepass = true; }
            //Node 2
            if (node2_crud == "delete" && node2_id == "") {
                $("#alert-invalid").append("<p class='text-node' style='color: #E60000;'>Cannot DELETE in Node 2 when ID field is empty.</p>");
                deletepass = false;
            } else if (node2_crud == "delete" && node2_id != "") { deletepass = true; }
            //Node 3
            if (node3_crud == "delete" && node3_id == "") {
                $("#alert-invalid").append("<p class='text-node' style='color: #E60000;'>Cannot DELETE in Node 3 when ID field is empty.</p>");
                deletepass = false;
            } else if (node3_crud == "delete" && node3_id != "") { deletepass = true; }
            $("#alert-invalid").show();
        }

        console.log("Not Empty: " + nodepass);
        console.log("Read: " + readpass);
        console.log("Update: " + updatepass);
        console.log("Delete: " + deletepass);

        if (readpass && nodepass && updatepass && deletepass) {
            $("#query-form").submit();
        }
    });
});

