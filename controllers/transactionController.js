const e = require('express');
const db = require('../models/db.js');
const ping = require('ping');


const ip1 = '178.128.223.106';
const ip2 =  '139.59.252.54';
const ip3 = '167.71.211.20';
var active1 = 0;
var active2 = 0;
var active3 = 0;
const transactionController = {
    postQuery: function(req, res) {
        var node_value = req.body.node;
        var limit_value = req.body.limit;

        if(limit_value === "") {
            var query = 'SELECT * FROM movies';
        } else {
            var query = 'SELECT * FROM movies LIMIT ' + limit_value;
        }

        db.query(node_value, query);

        res.render('main');
    },

    postMulti: function(req, res) {
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

        /*console.log("Node 1 Crud:" + node1_crud);
        console.log("Node 2 Crud:" + node2_crud);
        console.log("Node 3 Crud:" + node3_crud);
        console.log("Node 1 ID:" + node1_id);
        console.log("Node 2 ID:" + node2_id);
        console.log("Node 3 ID:" + node3_id);
        console.log("Node 1 Name:" + node1_name);
        console.log("Node 2 Name:" + node2_name);
        console.log("Node 3 Name:" + node3_name);
        console.log("Node 1 Year:" + node1_year);
        console.log("Node 2 Year:" + node2_year);
        console.log("Node 3 Year:" + node3_year);
        console.log("Node 1 Rank:" + node1_rank);
        console.log("Node 2 Rank:" + node2_rank);
        console.log("Node 3 Rank:" + node3_rank);

        console.log(node1);
        console.log(node2);
        console.log(node3);*/
        var trans = require('../controllers/transactionController.js');

        trans.replication(node1_query);
        trans.replication(node2_query);
        trans.replication(node3_query);
        res.render('main');
    },

    replication: function(node1_query){
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
                    else
                        active3 = 0;
                        if(node1_query.crud != "empty"){       
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
                                db.querynode1(query);
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
                                                }
                                                if(active3 ==1){
                                                    db.querynode3("INSERT INTO movies (movies.id, movies.name, movies.year, movies.rank) VALUES (" + result.id + ", \"" + result.name + "\", "+ result.year + ", " + result.rank + ")");
                                                    db.querynode3(query);
                                                }
                                                else {//store query to file of node3
                
                                                }
                                            }
                                            else if(result.year >= 1980 && node1_query.year < 1980){ //if query will be changed to below 1980
                                                if(active3 == 1){
                                                    db.querynode3("DELETE movies FROM movies WHERE id = " + node1_query.id);
                                                }
                                                else {
                                                    //store query to file of node 3
                                                }
                                                if(active2 == 1){
                                                    db.querynode2("INSERT INTO movies (movies.id, movies.name, movies.year, movies.rank) VALUES (" + result.id + ", \"" + result.name + "\", "+ result.year + ", " + result.rank + ")");
                                                    db.querynode2(query);
                                                }    
                                                else{
                                                    //store query to file of node 2
                                                }
                                            }
                                            else if(result.year < 1980 || node1_query.year < 1980){
                                                if(active2 == 1){
                                                    db.querynode2(query);
                                                    //console.log(query);
                                                }
                                            }  
                                            else if(result.year >= 1980 || node1_query.year >= 1980){
                                                if(active3 ==1){
                                                    db.querynode3(query);
                                                    
                                                }
                                            }
                                        });      
                                        db.querynode1(query);
                                    }
                                    else{
                                        db.callnode2("SELECT * FROM movies WHERE id = " + node1_query.id, function(res){
                                            if(res != undefined){
                                                res.forEach(function(result){
                                                    //if query will be changed to above 1979
                                                    if(node1_query.year >= 1980){
                                                        if(active2 == 1){
                                                            db.querynode2("DELETE movies FROM movies WHERE id = " + node1_query.id);
                                                        }
                                                        else{
                                                            //store query to file of node2
                                                        }
                                                        if(active3 ==1){
                                                            db.querynode3("INSERT INTO movies (movies.id, movies.name, movies.year, movies.rank) VALUES (" + result.id + ", \"" + result.name + "\", "+ result.year + ", " + result.rank + ")");
                                                            db.querynode3(query);
                                                        }
                                                        else {//store query to file of node3
                        
                                                        }
                                                    }
                                                    else{
                                                        if(active3 ==1){
                                                            db.querynode3(query);       
                                                        }
                                                        else{
                                                            //store query to file of node3
                                                        }
                                                    }
                                                    //store query to file of node1
                                                });      
                                            }
                                            else{
                                                db.callnode3("SELECT * FROM movies WHERE id = " + node1_query.id, function(res){
                                                    if(res != undefined){
                                                        res.forEach(function(result){
                                                            if(node1_query.year < 1980){ //if query will be changed to below 1980
                                                                if(active3 == 1){
                                                                    db.querynode3("DELETE movies FROM movies WHERE id = " + node1_query.id);
                                                                }
                                                                else {
                                                                    //store query to file of node 3
                                                                }
                                                                if(active2 == 1){
                                                                    db.querynode2("INSERT INTO movies (movies.id, movies.name, movies.year, movies.rank) VALUES (" + result.id + ", \"" + result.name + "\", "+ result.year + ", " + result.rank + ")");
                                                                    db.querynode2(query);
                                                                }    
                                                                else{
                                                                    //store query to file of node 2
                                                                }
                                                            }
                                                            else{
                                                                if(active3 ==1){
                                                                    db.querynode3(query);       
                                                                }
                                                                else{
                                                                    //store query to file of node3
                                                                }
                                                            }
                                                            //store query to file of node1
                                                        });      
                                                        db.querynode1(query);
                                                    }
                                                    else{
                                                        //file does not exist
                                                    }
                                                });
                                            }
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
                                                    }
                                                }
                                                if(result.year >= 1980){
                                                    db.querynode1(query);
                                                    if(active3 == 1){
                                                        db.querynode3(query);
                                                    }
                                                    else{
                                                        //save to sql file
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
                                                                }
                                                            });
                                                        }
                                                        else{
                                                        
                                                        }                                             
                                                    });
                                                }                                             
                                            });
                                            //save sql to node 1 text
                                        }                                             
                                    });               
                                }
                                else {
                                    //save to sql file
                                }            
                            }     
                        }
                });
            });
        });
    }
}

module.exports = transactionController;