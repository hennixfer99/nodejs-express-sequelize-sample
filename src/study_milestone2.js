const express = require('express');
const app = express();

app.get('/',(req, res) => {
    return res.send(`Hello This is your new route!`);
});

app.get('/hello-world/:name',(req, res) => {
    let name = req.params.name

    return res.send(`Hello ${name}!`);
});

module.exports = app
