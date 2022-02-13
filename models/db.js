// get the client
const mysql = require('mysql2');

var pooladdress = '178.128.223.106'
const pooluser = 'webapp'
const poolpass = '40654'
var pooldatabase = 'moviesmain'

// create the connection to database
const pool = mysql.createPool({
  host: pooladdress,
  user: pooluser,
  password: poolpass,
  database: pooldatabase,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection(function(err) {
    if (err) throw err;
    console.log("Connected to host: " + pooladdress);
    console.log("With user: " + pooluser);
    console.log("In database: " + pooldatabase);
});

/**pool.query("SELECT * FROM movies LIMIT 50",
        function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        console.log(fields);
});**/