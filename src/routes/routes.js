const express = require('express');
const expenseController = require('../controllers/expenseController.js');
const helloWorldController = require('../controllers/helloWorldController.js');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));

app.get('/hello-world', helloWorldController.helloWorld);

app.get('/hello-world/:name', helloWorldController.helloWorldParams);

app.get('/expense-controll', expenseController.getBills);

app.post('/expense-controll', expenseController.createNewBill);

app.put('/expense-controll/:id', expenseController.updateBill);

app.delete('/expense-controll/:id', expenseController.deleteBill);

module.exports = app;
