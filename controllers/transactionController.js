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
        var node1_query = req.body.query1;
        var node2_query = req.body.query2;
        var node3_query = req.body.query3;

        console.log(node1_query);
        console.log(node2_query);
        console.log(node3_query);
        
        db.multiquery(node1_query, node2_query, node3_query);
        
        res.render('main');
    }

}

module.exports = transactionController;