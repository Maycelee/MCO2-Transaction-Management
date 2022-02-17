const res = require('express/lib/response');
const mysql = require('mysql2');
const ping = require('ping');
const File = require('../public/js/file');

const ip1 = '178.128.223.106';
const ip2 =  '139.59.252.54';
const ip3 = '167.71.211.20';
const pooluser = 'webapp'
const poolpass = '40654'

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
    multipleStatements: true
});

const node2 = mysql.createPool({
    host: '139.59.252.54',
    user: pooluser,
    password: poolpass,
    database: 'moviessub1',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true
});

const node3 = mysql.createPool({
    host: '167.71.211.20',
    user: pooluser,
    password: poolpass,
    database: 'moviessub2',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true
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

    querynode1:  function(query){
        node1.query(query);
    },

    callnode1:  function(query, callback){
        node1.query(query, function(err, result, fields){
            return callback(result);
        });
    },

    querynode2: function(query){
        node2.query(query);
    },

    callnode2:  function(query, callback){
        node2.query(query, function(err, result, fields){
            return callback(result);
        });
    },

    querynode3: function(query){
        node3.query(query);
    },

    callnode3:  function(query, callback){
        node3.query(query, function(err, result, fields){
            return callback(result);
        });
    },

    //update recently reconnected node
    recover: function(status){
        var ping = require('ping');
        var query;
        if(status[0] == 1){
            console.log("Entered Node 1 Recovery");
            File.readNode1(function (res){
                if(res!=""){
                    console.log(res);
                    node1.query(res);
                    File.clearNodes1();
                }
            });
            
        }
        if(status[1] == 1){
            console.log("Entered Node 2 Recovery");
            File.readNode2(function (res){
                if(res!=""){
                    console.log(res);
                    node2.query(res);
                    File.clearNodes2();
                }
            });
        }
        if(status[2] == 1){
            console.log("Entered Node 3 Recovery");
            File.readNode3(function (res){
                if(res!=""){
                    console.log(res);
                    node3.query(res);
                    File.clearNodes3();
                }
            });
        }
    }

}

module.exports = database;