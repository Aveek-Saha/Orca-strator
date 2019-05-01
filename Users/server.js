const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

mongoose.connect('mongodb://aveek:aveek123@ds221645.mlab.com:21645/selfieless');
var Schema = mongoose.Schema;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: 'true', limit: '5mb' }));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.json({ type: 'application/vnd.api+json', limit: '5mb' }));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

var Act = mongoose.model('Act',{
    actId: Number,
    username: String,
    timestamp: String,
    caption: String,
    category: String,
    imgB64: String,
    upvotes: Number
});

var Category = mongoose.model('Category', {
    count: Number,
    name: String
});

var User = mongoose.model('User', {
    username: String,
    password: String
});

var count = 0;

app.get('/api/v1/_count', function (req, res) {
    // Get number of requests
    // Error codes: 200- ok, 405- method not allowed

    res.status(200)
    res.send([count]);
    
});

app.delete('/api/v1/_count', function (req, res) {
    // Get number of requests
    // Error codes: 200- ok, 405- method not allowed

    count = 0;
    res.status(200)
    res.send({});

});

app.post('/api/v1/users', function (req, res) {
    // Add User
    // Error codes: 201- created, 400- bad request, 405- method not allowed
    // console.log(req.body);

    count++;

    User.find({ username: req.body.username}, (err, users) =>{
        if(users.length == 0){
            if (/^[a-fA-F0-9]{40}$/.test(req.body.password)){
                User.create({
                    username: req.body.username,
                    password: req.body.password
                }, (err, c) => {
                        if (err) {
                            res.status(400)
                            res.send();
                        }
                    else {
                        res.status(201)
                        res.send({});
                    }
                });
            }
            else {
                res.status(400)
                res.send();
            }
        }
        else {
            res.status(400)
            res.send();
        }
    });
});

app.get('/api/v1/users', function (req, res) {
    // Get all Users
    // Error codes: 200- ok, 204- empty, 405- method not allowed
    // console.log(req.body);

    count++;

    User.find({}, (err, users) => {
        if (users.length != 0) {
            res.status(200);
            var arr = []
            users.forEach(user => {
                arr.push(user.username)
            });
            res.send(arr);
        }
        else {
            res.status(204)
            res.send([]);
        }
    });
});

app.route('/api/v1/users')
    .delete((req, res) => { res.status(405).send() })
    .put((req, res) => { res.status(405).send() })


app.delete('/api/v1/users/:username', function (req, res) {
    // Remove user
    // Error codes: 200- ok, 400- bad request, 405- method not allowed

    count ++;

    User.find({ username: req.params.username }, (err, users) => {
        if (users.length == 0) {
            res.status(400); //Bad Request because user does not exist
        }
        else {
            User.deleteOne({ username: req.params.username }, function (err) {
                if (err)
                    res.status(400);
                else
                    res.status(200);
            });
        }
        res.send({})
    });
    
});

app.route('/api/v1/users/:username')
    .get((req, res) => { res.status(405).send() })
    .post((req, res) => { res.status(405).send() })
    .put((req, res) => { res.status(405).send() })


app.listen(8000);
console.log("Server started");
