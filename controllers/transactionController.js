const e = require('express');
const db = require('../models/db.js');

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
        var node1 = {
            "crud": req.body.node1crud,
            "id": req.body.node1id,
            "name": req.body.node1name,
            "year": req.body.node1year,
            "rank": req.body.node1rank
        };

        var node2 = {
            "crud": req.body.node2crud,
            "id": req.body.node2id,
            "name": req.body.node2name,
            "year": req.body.node2year,
            "rank": req.body.node2rank
        };

        var node3 = {
            "crud": req.body.node3crud,
            "id": req.body.node3id,
            "name": req.body.node3name,
            "year": req.body.node3name,
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

        db.multiquery(node1, node2, node3);

        res.render('main');
    }

}

module.exports = transactionController;