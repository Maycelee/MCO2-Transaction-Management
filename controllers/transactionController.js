const e = require('express');
const db = require('../models/db.js');
const ping = require('ping');
const file = require('../public/js/file');


const ip1 = '178.128.223.106';
const ip2 =  '139.59.252.54';
const ip3 = '167.71.211.20';
var active1 = 0;
var active2 = 0;
var active3 = 0;
const transactionController = {
    postQuery: function(req, res) {
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
                    trans.postIsolation(isolation);

                    Promise.allSettled([trans.replication(node1_query),trans.replication(node2_query), trans.replication(node3_query)]).then(result => {
                        console.log("hello1");
                        trans.checkConsistency(node1_query);
                        trans.checkConsistency(node2_query);
                        trans.checkConsistency(node3_query);
                        //if(node1_query.id != node2_query.id){
                        //    trans.checkConsistency(node2_query);
                        //}
                        //if((node3_query.id != node2_query.id) && (node3_query.id != node2_query.id)){
                        //    trans.checkConsistency(node3_query);
                        //}
                    });                                
                });
            });
        });
        
        res.render('main');
    },

    postIsolation: function(level){
        var query = "SET TRANSACTION ISOLATION LEVEL ";
        if(level == "read-repeatable"){
            query = query + "REPEATABLE READ";
        }
        else if(level == "read-uncommitted"){
            query = query + "READ UNCOMMITTED";
        }
        else if(level == "read-committed"){
            query = query + "READ COMMITTED";
        }
        else if(level == "serializable"){
            query = query + "SERIALIZABLE";
        }
        
        if(active1 == 1){
            db.querynode1(query);
        }
        else{
            file.writeNode1(query);
        }
        if(active2 == 1){
            db.querynode2(query);
        }
        else{
            file.writeNode2(query);
        }
        if(active3 == 1){
            db.querynode3(query);
        }
        else{
            file.writeNode3(query);
        }
    },

    checkConsistency: function(node1_query){
        if(active1 == 1){
            db.callnode1("SELECT * FROM movies WHERE id = " + node1_query.id, function (res){
                if(res!=undefined){
                    res.forEach(function(result){
                        if(result.year < 1980){
                            if(active2 == 1){
                                db.callnode2("SELECT * FROM movies WHERE id = " + node1_query.id, function(res2){
                                    if(res2[0]!= undefined){
                                        res2.forEach(function(result2) {
                                            if((result.name != result2.name) || (result.year != result2.year) || (result.rank != result2.year)){
                                                query = "UPDATE movies SET movies.name = \"" + result.name + "\", movies.year = " + result.year + ", movies.rank = " + result.rank + " WHERE id = " + result.id;
                                                db.querynode2(query);
                                            }                                        
                                        });
                                    }
                                    else {
                                        if(active3 == 1)
                                            db.querynode3("DELETE movies FROM movies WHERE id = " + node1_query.id);
                                        else
                                            file.writeNode3("DELETE movies FROM movies WHERE id = " + node1_query.id);

                                        db.querynode2("INSERT INTO movies (movies.id, movies.name, movies.year, movies.rank) VALUES (" + result.id + ", \"" + result.name + "\", "+ result.year + ", " + result.rank + ")");
                                    }
                                });
                            }
                        }
                        if(result.year >= 1980){
                            if(active3 == 1){
                                db.callnode3("SELECT * FROM movies WHERE id = " + node1_query.id, function(res2){
                                    console.log("test");
                                    if(res2[0]!= undefined){
                                        
                                        res2.forEach(function(result2) {
                                            if((result.name != result2.name) || (result.year != result2.year) || (result.rank != result2.year)){
                                                query = "UPDATE movies SET movies.name = \"" + result.name + "\", movies.year = " + result.year + ", movies.rank = " + result.rank + " WHERE id = " + result.id;
                                                db.querynode3(query);
                                            }                                        
                                        });
                                    }
                                    else {
                                        if(active2 == 1)
                                            db.querynode2("DELETE movies FROM movies WHERE id = " + node1_query.id);
                                        else
                                            file.writeNode2("DELETE movies FROM movies WHERE id = " + node1_query.id);

                                        db.querynode3("INSERT INTO movies (movies.id, movies.name, movies.year, movies.rank) VALUES (" + result.id + ", \"" + result.name + "\", "+ result.year + ", " + result.rank + ")");
                                    }
                                });
                            }
                        }
                    });
                }
            });
        }
    },

    replication: function(node1_query){
        if(node1_query.crud != "empty"){       
            var query;
            //If the query type is READ 
            if(node1_query.crud == "read"){
                query = "SELECT * FROM movies WHERE id = " + node1_query.id;    
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
                
                db.callnode1("SELECT * FROM movies WHERE id = " + node1_query.id, function(res){
                    
                    if(res != undefined){
                        
                        res.forEach(function(result){
                            //if query will be changed to above 1979
                            if(result.year < 1980 && node1_query.year >= 1980){
                                if(active2 == 1){
                                    db.querynode2("DELETE movies FROM movies WHERE id = " + node1_query.id);
                                }
                                else{
                                    //store query to file of node2
                                    file.writeNode2("DELETE movies FROM movies WHERE id = " + node1_query.id);
                                }
                                if(active3 ==1){
                                    db.querynode3("INSERT INTO movies (movies.id, movies.name, movies.year, movies.rank) VALUES (" + result.id + ", \"" + result.name + "\", "+ result.year + ", " + result.rank + ")");
                                    db.querynode3(query);
                                }
                                else {//store query to file of node3
                                    file.writeNode3("INSERT INTO movies (movies.id, movies.name, movies.year, movies.rank) VALUES (" + result.id + ", \"" + result.name + "\", "+ result.year + ", " + result.rank + ")");
                                    file.writeNode3(query);
                                }
                            }
                            else if(result.year >= 1980 && node1_query.year < 1980){ //if query will be changed to below 1980
                                if(active3 == 1){
                                    db.querynode3("DELETE movies FROM movies WHERE id = " + node1_query.id);
                                }
                                else {
                                    //store query to file of node 3
                                    file.writeNode3("DELETE movies FROM movies WHERE id = " + node1_query.id);
                                }
                                if(active2 == 1){
                                    db.querynode2("INSERT INTO movies (movies.id, movies.name, movies.year, movies.rank) VALUES (" + result.id + ", \"" + result.name + "\", "+ result.year + ", " + result.rank + ")");
                                    db.querynode2(query);
                                }    
                                else{
                                    //store query to file of node 2
                                    file.writeNode2("INSERT INTO movies (movies.id, movies.name, movies.year, movies.rank) VALUES (" + result.id + ", \"" + result.name + "\", "+ result.year + ", " + result.rank + ")");
                                    file.writeNode2(query);
                                }
                            }
                            else if(result.year < 1980 || node1_query.year < 1980){
                                if(active2 == 1){
                                    db.querynode2(query);
                                    //console.log(query);
                                }
                                else
                                    file.writeNode2(query);
                            }  
                            else if(result.year >= 1980 || node1_query.year >= 1980){
                                if(active3 ==1){
                                    db.querynode3(query);
                                }
                                else //store query to file of node 3 
                                    file.writeNode3(query);
                            }
                        });      
                        db.querynode1(query);
                    }
                    else{
                        db.callnode2("SELECT * FROM movies WHERE id = " + node1_query.id, function(res){
                            if(res != undefined ){
                                res.forEach(function(result){
                                    //if query will be changed to above 1979
                                    if(node1_query.year >= 1980){
                                        if(active2 == 1){
                                            db.querynode2("DELETE movies FROM movies WHERE id = " + node1_query.id);
                                        }
                                        else{
                                            //store query to file of node2
                                            file.writeNode2("DELETE movies FROM movies WHERE id = " + node1_query.id);
                                        }
                                        if(active3 ==1){
                                            db.querynode3("INSERT INTO movies (movies.id, movies.name, movies.year, movies.rank) VALUES (" + result.id + ", \"" + result.name + "\", "+ result.year + ", " + result.rank + ")");
                                            db.querynode3(query);
                                        }
                                        else {//store query to file of node3
                                            file.writeNode3("INSERT INTO movies (movies.id, movies.name, movies.year, movies.rank) VALUES (" + result.id + ", \"" + result.name + "\", "+ result.year + ", " + result.rank + ")");
                                            file.writeNode3(query);
                                        }
                                    }
                                    else{
                                        if(active2 == 1){
                                            db.querynode2(query);       
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
                                    if(res != undefined){
                                        res.forEach(function(result){
                                            if(node1_query.year < 1980){ //if query will be changed to below 1980
                                                if(active3 == 1){
                                                    db.querynode3("DELETE movies FROM movies WHERE id = " + node1_query.id);
                                                }
                                                else {
                                                    //store query to file of node 3
                                                    file.writeNode3("DELETE movies FROM movies WHERE id = " + node1_query.id);
                                                }
                                                if(active2 == 1){
                                                    db.querynode2("INSERT INTO movies (movies.id, movies.name, movies.year, movies.rank) VALUES (" + result.id + ", \"" + result.name + "\", "+ result.year + ", " + result.rank + ")");
                                                    db.querynode2(query);
                                                }    
                                                else{
                                                    //store query to file of node 2
                                                    file.writeNode2("INSERT INTO movies (movies.id, movies.name, movies.year, movies.rank) VALUES (" + result.id + ", \"" + result.name + "\", "+ result.year + ", " + result.rank + ")");
                                                    file.writeNode2(query);
                                                }
                                            }
                                            else{
                                                if(active3 ==1){
                                                    db.querynode3(query);       
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
                var query = "DELETE movies FROM movies WHERE id = " + node1_query.id;

                if(active1 == 1){
                    db.callnode1("SELECT * FROM movies WHERE id = " + node1_query.id, function(res){
                        if(res != undefined){
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
                                if(res != undefined){
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
                                        if(res != undefined){
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