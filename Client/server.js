const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

mongoose.connect('mongodb://aveek:aveek123@ds221645.mlab.com:21645/selfieless');
var Schema = mongoose.Schema;

app.use(express.static(__dirname + '/dist'));
app.use(bodyParser.urlencoded({ extended: 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/', function (req, res) {
    res.render('index.html');
});

app.listen(8000);
console.log("Server started");
