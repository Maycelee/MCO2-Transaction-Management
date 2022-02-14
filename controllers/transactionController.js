const e = require('express');
const db = require('../models/db.js');

const transactionController = {
    postQuery: function(req, res) {
        var node_value = req.body.node;
        var limit_value = req.body.limit;

        if(limit_value == null) {
            var query = 'SELECT * FROM movies';
        } else {
            var query = 'SELECT * FROM movies LIMIT ' + limit_value;
        }

        db.query(node_value, query);

        res.render('main');
    }


}

module.exports = transactionController;