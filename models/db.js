const mysql = require('mysql2');
const ping = require('ping');

const ip1 = '178.128.223.106';
const ip2 =  '139.59.252.54';
const ip3 = '167.71.211.20';
const pooluser = 'webapp'
const poolpass = '40654'
var active1 = 0;
var active2 = 0;
var active3 = 0;
ping.sys.probe(ip1, function(active){
    if(active==1)
        active1 = 1;
});
ping.sys.probe(ip2, function(active){
    if(active==1)
        active2 = 1;
    });
ping.sys.probe(ip3, function(active){
    if(active==1)
        active3 = 1;
});        

const node1 = mysql.createPool({
    host: '178.128.223.106',
    user: pooluser,
    password: poolpass,
    database: 'moviesmain',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

const node2 = mysql.createPool({
    host: '139.59.252.54',
    user: pooluser,
    password: poolpass,
    database: 'moviessub1',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const node3 = mysql.createPool({
    host: '167.71.211.20',
    user: pooluser,
    password: poolpass,
    database: 'moviessub2',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const database = {
    // create the connection to database
    connect: function() {
        
        node1.getConnection(function (err) {
            //if(err) throw err;
            if(err) console.log("Unable to connect to Node 1");
            else console.log("Node 1: Connection Successful.");
        });

        node2.getConnection(function (err) {
            //if (err) throw err;
            if(err) console.log("Unable to connect to Node 2");
            else console.log("Node 2: Connection Successful.");
        });

        node3.getConnection(function (err) {
            //if (err) throw err;
            if(err) console.log("Unable to connect to Node 3");
            else console.log("Node 3: Connection Successful.");
        });
    },

    //Single query for either node 1, 2, or 3
    query: function(node, query){
        switch(node) {
            case 'node-1':
                node1.query(query,
                function (err, result, fields) {
                if (err) throw err;
                console.log(result);
                });
                break;
            case 'node-2':
                node2.query(query,
                        function (err, result, fields) {
                        if (err) throw err;
                        console.log(result);
                        });
                break;
            case 'node-3':
                node3.query(query,
        function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        });
                break;
        } 
    },

    //Multiple queries for concurrency
    multiquery: function(node1_query, node2_query, node3_query){
        //No concurrency yet
        
        console.log(active1);
        if(node1_query.crud != "empty"){       
            if(active1 == 1){
                var query;
                //If the query type is READ 
                if(node1_query.crud == "read"){
                    query = "SELECT * FROM movies WHERE";
                    var first = 0;
                    if(node1_query.id != ""){
                        query = query + " id = " + node1_query.id;
                        first = 1;
                    }
                    if(node1_query.name != ""){
                        if(first == 1){
                            query = query + " AND"; 
                        }
                        query = query + " name = \"" + node1_query.name + "\"";
                        first = 1;
                    }
                    if(node1_query.year != ""){
                        if(first == 1){
                            query = query + " AND"; 
                        }
                        query = query + " year = " + node1_query.year;
                        first = 1;
                    }
                    if(node1_query.rank != ""){
                        if(first == 1){
                            query = query + " AND"; 
                        }
                        query = query + " rank = " + node1_query.rank;
                        first = 1;
                    }   
                    console.log(query);
                    node1.query(query,
                        function (err, result, fields) {
                            if (err) throw err;
                            console.log(fields);
                    });
                }
                //if the query type is UPDATE
                if(node1_query.crud == "update"){
                    query = "UPDATE movies SET ";
                    var first = 0;
                    if(node1_query.name != ""){
                        query = query + " movies.name = \"" + node1_query.name + "\""; 
                        first = 1;
                    }
                    if(node1_query.year != ""){
                        if(first == 1){
                            query = query + ",";
                        }
                        query = query + " movies.year = " + node1_query.year; 
                        first = 1;
                    }
                    if(node1_query.rank != ""){
                        if(first == 1){
                            query = query + ",";
                        }
                        query = query + " movies.rank = " + node1_query.rank;
                        first = 1;
                    }
                    query = query + " WHERE id = " + node1_query.id;
                    node1.query("SELECT * FROM movies WHERE id = " + node1_query.id, 
                    function(err, result, fields){
                        if(result != undefined){
                            result.forEach(function(result){
                                //if query will be changed to above 1979
                                if(result.year < 1980 && node1_query.year >= 1980){
                                    if(active2 == 1){
                                        node2.query("DELETE movies FROM movies WHERE id = " + node1_query.id);
                                    }
                                    else{
                                        //store query to file of node2
                                    }
                                    if(active3 ==1){
                                        node3.query("INSERT INTO movies (movies.id, movies.name, movies.year, movies.rank) VALUES (" + result.id + ", \"" + result.name + "\", "+ result.year + ", " + result.rank + ")", function(){
                                            node3.query(query);
                                        });
                                        
                                    }
                                    else {//store query to file of node3
    
                                    }
                                }
                                else if(result.year >= 1980 && node1_query.year < 1980){ //if query will be changed to below 1980
                                    if(active3 == 1){
                                        node3.query("DELETE movies FROM movies WHERE id = " + node1_query.id);
                                    }
                                    else {
                                        //store query to file of node 3
                                    }
                                    if(active2 == 1){
                                        node2.query("INSERT INTO movies (movies.id, movies.name, movies.year, movies.rank) VALUES (" + result.id + ", \"" + result.name + "\", "+ result.year + ", " + result.rank + ")",function (){
                                            node2.query(query);
                                            console.log(query);
                                        });
                                        
                                    }    
                                    else{
                                        //store query to file of node 2
                                    }
                                }
                                else if(result.year < 1980 || node1_query.year < 1980){
                                    if(active2 == 1){
                                        node2.query(query);
                                        //console.log(query);
                                    }
                                }  
                                else if(result.year >= 1980 || node1_query.year >= 1980){
                                    if(active3 ==1){
                                        node3.query(query);
                                        
                                    }
                                }
                            });      
                            node1.query(query);
                        }
                    });
                }
            }    
        }
        
        if(node2_query.crud != 'empty'){
            node1.query(node2_query,
                function (err, result, fields) {
                    if (err) throw err;
                    console.log(result);
            });
        }
        
        if(node3_query.crud != 'empty'){
            node1.query(node3_query,
                function (err, result, fields) {
                    if (err) throw err;
                    console.log(result);
            });
        }
    },

    isolationquery: function(query){
        var ping = require('ping');

        ping.sys.probe(ip1, function(active){
            if (active == 1){
                node1.query(query,
                    function(err, result, fields){
                        if (err) throw err;
                    });
            }
            else {
                //store to file
            }
        });

        ping.sys.probe(ip2, function(active){
            if (active == 1){
                node2.query(query,
                    function(err, result, fields){
                        if (err) throw err;
                    });
            }
            else {
                //store to file
            }
        });

        ping.sys.probe(ip3, function(active){
            if (active == 1){
                node3.query(query,
                    function(err, result, fields){
                        if (err) throw err;
                    });
            }
            else {
                //store to file
            }
        });
    },

    //update recently reconnected node
    recover: function(status){
        var ping = require('ping');
        var query;
        if(status[0] == 1){
            console.log("Entered Node 1 Recovery");
            /*           
            ping.sys.probe(ip2, function(active){
                //var info = active ? 'IP ' + host + ' = Active' : 'IP ' + host + ' = Non-Active';
                if(active == 1){
                    query = "DELETE movies FROM movies WHERE movies.year < 1980";
                    node1.query(query,
                        function (err, result, fields) {
                        if (err) throw err;
                        
                    });
                    query = "SELECT * FROM movies";
                    node2.query( query,  
                        function (err, result, fields) {
                            result.forEach( function(object){
                                var query2 = "INSERT INTO movies (movies.id, movies.name, movies.year, movies.rank) VALUES (" + object.id + ", \"" + object.name + "\"," + object.year + ", " + object.rank + ")"
                                node1.query(query2,
                                    function (err, result, fields) {
                                    if (err) throw err;
                                    
                                });
                            })
                        }
                    )
                }
            });
            ping.sys.probe(ip3, function(active){
                //var info = active ? 'IP ' + host + ' = Active' : 'IP ' + host + ' = Non-Active';
                if(active == 1){
                    query = "DELETE movies FROM movies WHERE movies.year >= 1980";
                    node1.query(query,
                        function (err, result, fields) {
                        if (err) throw err;
                    });
                    query = "SELECT * FROM movies";
                    node3.query( query, 
                        function (err, result, fields) {
                            result.forEach( function(object){
                                var query3 = "INSERT INTO movies (movies.id, movies.name, movies.year, movies.rank) VALUES (" + object.id + ", \"" + object.name + "\", "+ object.year + ", " + object.rank + ")"
                                node1.query(query3,
                                    function (err, result, fields) {
                                    if (err) throw err;
                                });
                            })
                        }
                    )
                }
            });*/
        }
        if(status[1] == 1){
            console.log("Entered Node 2 Recovery");
        }
        if(status[2] == 1){
            console.log("Entered Node 3 Recovery");
        }
    }

}

/**pool.getConnection(function(err) {
    if (err) throw err;
    console.log("Connected to host: " + pooladdress);
    console.log("With user: " + pooluser);
    console.log("In database: " + pooldatabase);
});

pool.query("SELECT * FROM movies LIMIT 50",
        function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        console.log(fields);
});**/

module.exports = database;