const mysql = require('mysql2');

const pooluser = 'webapp'
const poolpass = '40654'

const node1 = mysql.createPool({
    host: '178.128.223.106',
    user: pooluser,
    password: poolpass,
    database: 'moviesmain',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
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

// create the connection to database
const database = {
    connect: function() {
        node1.getConnection(function (err) {
            if (err) throw err;
            console.log("Node 1: Connection Successful.");
        });

        node2.getConnection(function (err) {
            if (err) throw err;
            console.log("Node 2: Connection Successful.");
        });

        node3.getConnection(function (err) {
            if (err) throw err;
            console.log("Node 3: Connection Successful.");
        });
    },

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