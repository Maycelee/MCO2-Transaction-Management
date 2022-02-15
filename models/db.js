const mysql = require('mysql2');
const ping = require('ping');

const ip1 = '178.128.223.106';
const ip2 =  '139.59.252.54';
const ip3 = '167.71.211.20';
const pooluser = 'webapp'
const poolpass = '40654'

const node1 = mysql.createPool({
    host: '178.128.223.106',
    user: pooluser,
    password: poolpass,
    database: 'moviesmain',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    rowsAsArray: true
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


        if(node1_query != ''){
            node1.query(node1_query,
                function (err, result, fields) {
                    if (err) throw err;
                    console.log(result);
            });
        }
        
        if(node2_query != ''){
            node1.query(node2_query,
                function (err, result, fields) {
                    if (err) throw err;
                    console.log(result);
            });
        }
        
        if(node3_query != ''){
            node1.query(node3_query,
                function (err, result, fields) {
                    if (err) throw err;
                    console.log(result);
            });
        }
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