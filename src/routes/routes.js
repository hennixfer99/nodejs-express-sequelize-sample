const express = require('express');
const expenseController = require('../controllers/expenseController.js');
const helloWorldController = require('../controllers/helloWorldController.js');
const bodyParser = require('body-parser');
const paymentController = require('../controllers/PaymentController.js');
const controlTypeController = require('../controllers/controlTypeController.js');
const app = express();

//milestone 1

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));

app.get('/hello-world', helloWorldController.helloWorld);

app.get('/hello-world/:name', helloWorldController.helloWorldParams);

//milestone 2

app.get('/expense-controll', expenseController.getBills);

app.post('/expense-controll', expenseController.createNewBill);

app.put('/expense-controll/:id', expenseController.updateBill);

app.delete('/expense-controll/:id', expenseController.deleteBill);

//milestone 3

app.get('/expense-controll/payment', paymentController.getPayments);

app.get('/expense-controll/:id/payment', paymentController.getPaymentInControlId);

app.post('/expense-controll/payment', paymentController.createNewPayment);

app.put('/expense-controll/payment/:id', paymentController.updatePayment);

app.delete('/expense-controll/payment/:id', paymentController.deletePayment);

//milestone 4

app.get('/control-type', controlTypeController.getStatus)

app.get('/control-type/:id', controlTypeController.getStatusInControlId)

app.post('/control-type', controlTypeController.createNewStatus)

app.put('/control-type/:id', controlTypeController.updateStatus)

app.delete('/control-type/:id', controlTypeController.deleteStatus)

app.post('/control-type/:id/expense-controll', controlTypeController.controlTypeAssociation)

app.post('/expense-controll/:id/control-type', controlTypeController.controlAssociation)

app.delete('/control-type/:id/expense-controll', controlTypeController.controlTypeDissociation)

app.delete('/expense-controll/:id/control-type', controlTypeController.controlDissociation)

module.exports = app;
