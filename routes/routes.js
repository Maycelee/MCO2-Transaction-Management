const express = require('express');
const controller = require('../controllers/controller.js');
const transactionController = require('../controllers/transactionController.js');
const app = express();

app.get('/favicon.ico', controller.getFavicon);
app.get('/', controller.getIndex);

app.post('/query', transactionController.postQuery);

module.exports = app;