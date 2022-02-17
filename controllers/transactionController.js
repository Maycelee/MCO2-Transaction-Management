const e = require('express');
const db = require('../models/db.js');
const ping = require('ping');
const file = require('../public/js/file');
const { system } = require('nodemon/lib/config');

const ip1 = '178.128.223.106';
const ip2 =  '139.59.252.54';
const ip3 = '167.71.211.20';
var active1 = 0;
var active2 = 0;
var active3 = 0;
const transactionController = {
    postQuery: function(req, res) {
        db.querynode3("START TRANSACTION; UPDATE movies SET  movies.year = 2001 WHERE id = 1; COMMIT;");

        var node1_query = {
            "crud": req.body.node1crud,
            "id": req.body.node1id,
            "name": req.body.node1name,
            "year": req.body.node1year,
            "rank": req.body.node1rank
        };

        var node2_query = {
            "crud": req.body.node2crud,
            "id": req.body.node2id,
            "name": req.body.node2name,
            "year": req.body.node2year,
            "rank": req.body.node2rank
        };

        var node3_query = {
            "crud": req.body.node3crud,
            "id": req.body.node3id,
            "name": req.body.node3name,
            "year": req.body.node3year,
            "rank": req.body.node3rank
        };
        //db.connect;
        var isolation = req.body.isolation;
        var trans = require('../controllers/transactionController.js');
        ping.sys.probe(ip1, function(activen1){
            if(activen1==1)
                active1 = 1;
            else
                active1 = 0;
            ping.sys.probe(ip2, function(activen2){
                if(activen2==1)
                    active2 = 1;
                else
                    active2 = 0;
                
                ping.sys.probe(ip3, function(activen3){
                    if(activen3==1)
                        active3 = 1;
                    else{
                        active3 = 0;
                    }
                    var trans = require('../controllers/transactionController.js');
                    trans.postIsolation(isolation, function(res){
                        res = res + "; START TRANSACTION; ";
                        var stack = [];

                        //trans.replication(res, node1_query)
                        
                        if(node1_query.crud != "empty");
                            stack.push(trans.replication(res, node1_query));
                        if(node2_query.crud != "empty");
                            stack.push(trans.replication(res, node2_query));
                        if(node3_query.crud != "empty");
                            stack.push(trans.replication(res, node3_query));

                        
                        Promise.allSettled(stack).then(result => {
                            db.callnode1("SELECT @@transaction_ISOLATION", function(res2){
                                //if(node1_query.crud != "empty");
                                    //trans.checkConsistency(res, node1_query);
                                //if(node2_query.crud != "empty");
                                    //trans.checkConsistency(res, node2_query);
                                //if(node3_query.crud != "empty");
                                    //trans.checkConsistency(res, node3_query);
                            });
                        });  
                    });
                    
                                                  
                });
            });
        });
        
        res.render('main');
    },

    postIsolation: function(level, callback){
        var query = "SET TRANSACTION ISOLATION LEVEL ";
        if(level == "read-repeatable"){
            query = query + "REPEATABLE READ";
        }
        else if(level == "read-uncommitted"){
            query = query + "READ UNCOMMITTED";
        }
        else if(level == "read-committed"){
            query = query + "READ COMMITTED";
            console.log("yes");
        }
        else if(level == "serializable"){
            query = query + "SERIALIZABLE";
        }
        console.log(query);
        
        return callback(query);
    },

    checkConsistency: async function(startquery, node1_query){
        if(active1 == 1){
            db.callnode1("SELECT * FROM movies WHERE id = " + node1_query.id, function (res){
                if(res!=undefined){
                if(res[0] != undefined){
                    res.forEach(function(result){
                        if(result.year < 1980){
                            if(active2 == 1){
                                db.callnode2("SELECT * FROM movies WHERE id = " + node1_query.id, function(res2){
                                    if(res2[0]!= undefined){
                                        res2.forEach(function(result2) {
                                            if((result.name != result2.name) || (result.year != result2.year) || (result.rank != result2.year)){
                                                query = startquery + "UPDATE movies SET movies.name = \"" + result.name + "\", movies.year = " + result.year + ", movies.rank = " + result.rank + " WHERE id = " + result.id;
                                                db.querynode2(query);
                                            }                                        
                                        });
                                    }
                                    else {
                                        if(active3 == 1)
                                            db.querynode3(startquery + "DELETE movies FROM movies WHERE id = " + node1_query.id + "; COMMIT;");
                                        else
                                            file.writeNode3(startquery + "DELETE movies FROM movies WHERE id = " + node1_query.id + "; COMMIT;");

                                        db.querynode2(startquery + "INSERT INTO movies (movies.id, movies.name, movies.year, movies.rank) VALUES (" + result.id + ", \"" + result.name + "\", "+ result.year + ", " + result.rank + "); COMMIT;");
                                    }
                                });
                            }
                        }
                        if(result.year >= 1980){
                            if(active3 == 1){
                                db.callnode3("SELECT * FROM movies WHERE id = " + node1_query.id, function(res2){
                                    if(res2[0]!= undefined){
                                        
                                        res2.forEach(function(result2) {
                                            if((result.name != result2.name) || (result.year != result2.year) || (result.rank != result2.year)){
                                                query = startquery +  "UPDATE movies SET movies.name = \"" + result.name + "\", movies.year = " + result.year + ", movies.rank = " + result.rank + " WHERE id = " + result.id + "; COMMIT;";
                                                db.querynode3(query);
                                            }                                        
                                        });
                                    }
                                    else {
                                        if(active2 == 1)
                                            db.querynode2(startquery + "DELETE movies FROM movies WHERE id = " + node1_query.id + "; COMMIT;");
                                        else
                                            file.writeNode2(startquery + "DELETE movies FROM movies WHERE id = " + node1_query.id + "; COMMIT;");

                                        db.querynode3(startquery + "INSERT INTO movies (movies.id, movies.name, movies.year, movies.rank) VALUES (" + result.id + ", \"" + result.name + "\", "+ result.year + ", " + result.rank + "); COMMIT;");
                                    }
                                });
                            }
                        }
                    });
                }
                }
            });
        }
    },

    replication: function(startquery, node1_query){
        if(node1_query.crud != "empty"){       
            var query;
            //If the query type is READ 
            var node1val;
            var node2val;
            var node3val;
            
            if(active1 == 1){
                db.callnode1("SELECT * FROM movies WHERE id = " + node1_query.id, function(res){
                    node1val = res;
                });
            }
            if(active2 == 1){
                db.callnode2("SELECT * FROM movies WHERE id = " + node1_query.id, function(res){
                    node2val = res;
                });
            }
            if(active3 == 1){
                db.callnode3("SELECT * FROM movies WHERE id = " + node1_query.id, function(res){
                    node3val = res;
                });
            }

            if(node1_query.crud == "read"){
                query = startquery + "SELECT * FROM movies WHERE id = " + node1_query.id + "; COMMIT";    
                if(active1 == 1){
                    db.querynode1(query);
                }
                else{
                    if(active2 == 1){
                        db.callnode2(query, function(res){
                            if(res[0] == undefined){
                                db.querynode3(query);
                            }
                        });
                    }
                }
            }
            //if the query type is UPDATE
            if(node1_query.crud == "update"){
                query = startquery + "UPDATE movies SET ";
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
                query = query + " WHERE id = " + node1_query.id + "; COMMIT;";
                
                db.callnode1("SELECT * FROM movies WHERE id = " + node1_query.id , function(res){
                    
                    if(res != undefined || res[0] != undefined){
                        
                        res.forEach(async function(result){
                            //if query will be changed to above 1979
                            if(result.year < 1980 && node1_query.year >= 1980){
                                if(active2 == 1){
                                    await db.querynode2(startquery+ "DELETE movies FROM movies WHERE id = " + node1_query.id + "; COMMIT;");
                                }
                                else{
                                    //store query to file of node2
                                    file.writeNode2(startquery + "DELETE movies FROM movies WHERE id = " + node1_query.id + "; COMMIT;");
                                }
                                if(active3 ==1){
                                    await db.querynode3(startquery + "INSERT INTO movies (movies.id, movies.name, movies.year, movies.rank) VALUES (" + result.id + ", \"" + result.name + "\", "+ result.year + ", " + result.rank + "); COMMIT;");
                                    await db.querynode3(query);
                                }
                                else {//store query to file of node3
                                    file.writeNode3(startquery + "INSERT INTO movies (movies.id, movies.name, movies.year, movies.rank) VALUES (" + result.id + ", \"" + result.name + "\", "+ result.year + ", " + result.rank + "); COMMIT;");
                                    file.writeNode3(query);
                                }
                            }
                            else if(result.year >= 1980 && node1_query.year < 1980){ //if query will be changed to below 1980
                                if(active3 == 1){
                                    await db.querynode3(startquery + "DELETE movies FROM movies WHERE id = " + node1_query.id + "; COMMIT;");
                                }
                                else {
                                    //store query to file of node 3
                                    file.writeNode3(startquery + "DELETE movies FROM movies WHERE id = " + node1_query.id + "; COMMIT;");
                                }
                                if(active2 == 1){
                                    await db.querynode2(startquery + "INSERT INTO movies (movies.id, movies.name, movies.year, movies.rank) VALUES (" + result.id + ", \"" + result.name + "\", "+ result.year + ", " + result.rank + "); COMMIT;");
                                    await db.querynode2(query);
                                }    
                                else{
                                    //store query to file of node 2
                                    file.writeNode2(startquery + "INSERT INTO movies (movies.id, movies.name, movies.year, movies.rank) VALUES (" + result.id + ", \"" + result.name + "\", "+ result.year + ", " + result.rank + "); COMMIT;");
                                    file.writeNode2(query);
                                }
                            }
                            else if(result.year < 1980 || node1_query.year < 1980){
                                if(active2 == 1){
                                    await db.querynode2(query);
                                    console.log(query);
                                }
                                else
                                    file.writeNode2(query);
                            }  
                            else if(result.year >= 1980 || node1_query.year >= 1980){
                                if(active3 ==1){
                                    console.log(await db.querynode3(query))
                                }
                                else //store query to file of node 3 
                                    file.writeNode3(query);
                            }
                        });      
                        db.querynode1(query);
                    }
                    else{
                        db.callnode2("SELECT * FROM movies WHERE id = " + node1_query.id, function(res){
                            if(res != undefined || res[0] != undefined ){
                                res.forEach( async function(result){
                                    //if query will be changed to above 1979
                                    if(node1_query.year >= 1980){
                                        if(active2 == 1){
                                            await db.querynode2(startquery + "DELETE movies FROM movies WHERE id = " + node1_query.id + "; COMMIT;");
                                        }
                                        else{
                                            //store query to file of node2
                                            file.writeNode2(startquery + "DELETE movies FROM movies WHERE id = " + node1_query.id + "; COMMIT;");
                                        }
                                        if(active3 ==1){
                                            await db.querynode3(startquery + "INSERT INTO movies (movies.id, movies.name, movies.year, movies.rank) VALUES (" + result.id + ", \"" + result.name + "\", "+ result.year + ", " + result.rank + "); COMMIT;");
                                            await db.querynode3(query);
                                        }
                                        else {//store query to file of node3
                                            file.writeNode3(startquery + "INSERT INTO movies (movies.id, movies.name, movies.year, movies.rank) VALUES (" + result.id + ", \"" + result.name + "\", "+ result.year + ", " + result.rank + "); COMMIT;");
                                            file.writeNode3(query);
                                        }
                                    }
                                    else{
                                        if(active2 == 1){
                                            await db.querynode2(query);       
                                        }
                                        else{
                                            //store query to file of node3
                                            file.writeNode2(query);
                                        }
                                    }
                                    //store query to file of node 1
                                    file.writeNode1(query);
                                });      
                            }
                            
                                db.callnode3("SELECT * FROM movies WHERE id = " + node1_query.id, function(res){
                                    if(res != undefined || res[0] != undefined){
                                        res.forEach(async function(result){
                                            if(node1_query.year < 1980){ //if query will be changed to below 1980
                                                if(active3 == 1){
                                                    await db.querynode3(startquery + "DELETE movies FROM movies WHERE id = " + node1_query.id + "; COMMIT;");
                                                }
                                                else {
                                                    //store query to file of node 3
                                                    file.writeNode3(startquery + "DELETE movies FROM movies WHERE id = " + node1_query.id + "; COMMIT;");
                                                }
                                                if(active2 == 1){
                                                    await db.querynode2(startquery + "INSERT INTO movies (movies.id, movies.name, movies.year, movies.rank) VALUES (" + result.id + ", \"" + result.name + "\", "+ result.year + ", " + result.rank + "); COMMIT;");
                                                    await db.querynode2(query);
                                                }    
                                                else{
                                                    //store query to file of node 2
                                                    file.writeNode2(startquery + "INSERT INTO movies (movies.id, movies.name, movies.year, movies.rank) VALUES (" + result.id + ", \"" + result.name + "\", "+ result.year + ", " + result.rank + "); COMMIT;");
                                                    file.writeNode2(query);
                                                }
                                            }
                                            else{
                                                if(active3 ==1){
                                                    await db.querynode3(query);       
                                                }
                                                else{
                                                    //store query to file of node3
                                                    file.writeNode3(query);
                                                }
                                            }
                                            //store query to file of node1
                                            file.writeNode1(query);
                                        });      
                                    }
                                    else{
                                        //file does not exist
                                    }
                                });
                            
                        });
                    }
                });
            }
            //delete function
            if(node1_query.crud == "delete"){
                var query = startquery + "DELETE movies FROM movies WHERE id = " + node1_query.id + "; COMMIT;";

                if(active1 == 1){
                    db.callnode1("SELECT * FROM movies WHERE id = " + node1_query.id, function(res){
                        if(res != undefined || res[0] != undefined){
                            res.forEach(function(result){
                                if(result.year < 1980){
                                    db.querynode1(query);
                                    if(active2 == 1){
                                        db.querynode2(query);
                                    }
                                    else{
                                        //save to sql file
                                        file.writeNode2(query);
                                    }
                                }
                                if(result.year >= 1980){
                                    db.querynode1(query);
                                    if(active3 == 1){
                                        db.querynode3(query);
                                    }
                                    else{
                                        //save to sql file
                                        file.writeNode3(query);
                                    }
                                }
                            });
                        }
                        else{
                            db.callnode2("SELECT * FROM movies WHERE id = " + node1_query.id, function(res){
                                if(res != undefined || res[0] != undefined){
                                    res.forEach(function(result){
                                        if(active2 == 1){
                                            db.querynode2(query);
                                        }
                                        else{
                                            //save sql to node 2 text file
                                            file.writeNode2(query);
                                        }
                                    });
                                }
                                else{
                                    db.callnode3("SELECT * FROM movies WHERE id = " + node1_query.id, function(res){
                                        if(res != undefined || res[0] != undefined){
                                            res.forEach(function(result){
                                                if(active3 == 1){
                                                    db.querynode3(query);
                                                }
                                                else{
                                                    //save sql to node 3 text
                                                    file.writeNode3(query);
                                                }
                                            });
                                        }
                                        else{
                                            //file does not exist
                                        }                                             
                                    });
                                }                                             
                            });
                            file.writeNode1(query);
                        }                                             
                    });               
                }
                else {
                    //save to sql file
                    file.writeNode1(query);
                }            
            }     
        }    
    }
}

module.exports = transactionController;