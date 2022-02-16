$(document).ready(function () {
    //When Multiple Queries is Clicked
	$("#radio-multi").click(function () {
        //Initialize Page
        $("#query-form").attr("action","/multiquery");
        $(".text-transaction").html(
            "<p class='text-transaction'><a onclick='window.location.href=this'>Back |</a></p>"
        )
        $("#execute-button").show();
        $("#generate-button").hide();
        

        $("#query-form").html(
            //Node 1 Query Input Boxes
            "<p class='text-node'>Node 1</p>" +
            
            "<div id='node1-query' class='node-query'>"+
            "<select id='node1-crud' name='node1crud' class='select-crud'>" +
                "<option value='empty'></option>" +
                "<option value='read'>Read</option>" +
                "<option value='update'>Update</option>" +
                "<option value='delete'>Delete</option>" +
            "</select>" +

            "<input type='search' id='node1-id' class='query-crud' name='node1id' placeholder='ID' autocomplete='off'>" +
            "<input type='search' id='node1-name' class='query-crud' name='node1name' placeholder='Name' autocomplete='off'>" +
            "<input type='search' id='node1-year' class='query-crud' name='node1year' placeholder='Year' autocomplete='off'>" +
            "<input type='search' id='node1-rank' class='query-crud' name='node1rank' placeholder='Rank' autocomplete='off'></input>" +
            "</div><br>"+

            //Node 2 Query Input Boxes
            "<p class='text-node'>Node 2</p>" +

            "<div id='node2-query' class='node-query'>"+
            "<select id='node2-crud' name='node2crud' class='select-crud'>" +
                "<option value='empty'></option>" +
                "<option value='read'>Read</option>" +
                "<option value='update'>Update</option>" +
                "<option value='delete'>Delete</option>" +
            "</select>" +

            "<input type='search' id='node2-id' class='query-crud' name='node2id' placeholder='ID' autocomplete='off'>" +
            "<input type='search' id='node2-name' class='query-crud' name='node2name' placeholder='Name' autocomplete='off'>" +
            "<input type='search' id='node2-year' class='query-crud' name='node2year' placeholder='Year' autocomplete='off'>" +
            "<input type='search' id='node2-rank' class='query-crud' name='node2rank' placeholder='Rank' autocomplete='off'></input>" +
            "</div><br>"+

            //Node 3 Query Input Boxes
            "<p class='text-node'>Node 3</p>" +
            
            "<div id='node3-query' class='node-query'>"+
            "<select id='node3-crud' name='node3crud' class='select-crud'>" +
                "<option value='empty'></option>" +
                "<option value='read'>Read</option>" +
                "<option value='update'>Update</option>" +
                "<option value='delete'>Delete</option>" +
            "</select>" +

            "<input type='search' id='node3-id' class='query-crud' name='node3id' placeholder='ID' autocomplete='off'>" +
            "<input type='search' id='node3-name' class='query-crud' name='node3name' placeholder='Name' autocomplete='off'>" +
            "<input type='search' id='node3-year' class='query-crud' name='node3year' placeholder='Year' autocomplete='off'>" +
            "<input type='search' id='node3-rank' class='query-crud' name='node3rank' placeholder='Rank' autocomplete='off'></input>" +
            "</div><br>"+

            "<p class='text-node'>Isolation Level</p>" +
            "<select name='isolation' id='form-isolation'>" +
                "<option value='read-uncommitted'>Read Uncommitted</option>" +
                "<option value='read-committed'>Read Committed</option>" +
                "<option value='read-repeatable'>Read Repeatable</option>" +
                "<option value='serializable'>Serializable</option>" +
            "</select>" +

            "<input type='numbe' id='limit-quantity' class='form-generate' name='limit' min='1' placeholder='Row Limit'>"
        );
    
        $("#node1-crud").change(function() {
            var val = $(this).val();
            switch(val) {
                case 'empty':
                    $("#node3-name").show();
                    $("#node3-year").show();
                    $("#node3-rank").show();

                    $("#node3-name").attr("placeholder", "Name");
                    $("#node3-year").attr("placeholder", "Year");
                    $("#node3-rank").attr("placeholder", "Rank");
                case 'read':
                    $("#node1-name").show();
                    $("#node1-year").show();
                    $("#node1-rank").show();

                    $("#node1-name").attr("placeholder", "Name");
                    $("#node1-year").attr("placeholder", "Year");
                    $("#node1-rank").attr("placeholder", "Rank");
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
                    $("#node3-name").show();
                    $("#node3-year").show();
                    $("#node3-rank").show();

                    $("#node3-name").attr("placeholder", "Name");
                    $("#node3-year").attr("placeholder", "Year");
                    $("#node3-rank").attr("placeholder", "Rank");
                case 'read':
                    $("#node2-name").show();
                    $("#node2-year").show();
                    $("#node2-rank").show();

                    $("#node2-name").attr("placeholder", "Name");
                    $("#node2-year").attr("placeholder", "Year");
                    $("#node2-rank").attr("placeholder", "Rank");
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
                case 'read':
                    $("#node3-name").show();
                    $("#node3-year").show();
                    $("#node3-rank").show();

                    $("#node3-name").attr("placeholder", "Name");
                    $("#node3-year").attr("placeholder", "Year");
                    $("#node3-rank").attr("placeholder", "Rank");
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
    });

    

    $("#execute-button").click(function () {
        var node1_val = $("#node1-crud").val();
        var node2_val = $("#node2-crud").val();
        var node3_val = $("#node3-crud").val();

        console.log(node1_val);
        console.log(node2_val);
        console.log(node3_val);

        if(node1_val == "empty" && node2_val =="empty" && node3_val == "empty"){
            alert("All fields cannot be empty. Fill at least one.");
        } else {
            $("#query-form").submit();
        }
    });
});

