const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

mongoose.connect('mongodb://aveek:aveek123@ds221645.mlab.com:21645/selfieless');
var Schema = mongoose.Schema;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

var Act = mongoose.model('Act',{
    _id: Number,
    actId: Number,
    username: String,
    timestamp: String,
    caption: String,
    category: String,
    imgB64: String,
    upvotes: Number
});

var Category = mongoose.model('Category', {
    _id: String,
    count: Number,
    name: String,
    acts: []
});


app.get('/', function (req, res) {
    res.render('index.html');
});


app.post('/api/v1/users', function (req, res) {
    // Add User
    // Error codes: 201- created, 400- bad request, 405- method not allowed
});

app.delete('/api/v1/users/:username', function (req, res) {
    // Remove user
    // Error codes: 200- ok, 400- bad request, 405- method not allowed

    res.send("Username is " + req.params.username);
});

app.get('/api/v1/categories', function (req, res) {
    // Lsit all categories
    // Error codes: 200- ok, 204- no content, 405- method not allowed

    Category.find({}, (err, cats) => {
        if (err)
            res.status(400);
        else{
            var arr = {};
            cats.forEach(cat => {
                arr[cat.name] = cat.count;
            })
            res.status(200).send(arr);
        }
    });
});

app.post('/api/v1/categories', function (req, res) {
    // Add a category
    // Error codes: 201- created, 400- bad request, 405- method not allowed

    req.body.forEach(cat => {
        Category.create({
            _id: cat,
            count: 0,
            name: cat,
            acts: []
        }, (err, c) => {
            if (err) 
                res.status(400);
            else
                res.status(200);
        });
    });
    res.send({})
});

app.delete('/api/v1/categories/:categoryName', function (req, res) {
    // Remove a category
    // Error codes: 200- ok, 400- bad request, 405- method not allowed

    Category.deleteOne({ _id: req.params.categoryName }, function (err) {
        if (err)
            res.status(400);
        else
            res.status(200);
        res.send({})        
    });
});

app.get('/api/v1/categories/:categoryName/acts', function (req, res) {
    // List acts in a category < 500
    // Error codes: 200- ok, 204- no content, 405- method not allowed, 413- payload too large

    res.send("tagId is set to " + req.query.start);
});

app.get('/api/v1/categories/:categoryName/acts/size', function (req, res) {
    // Number of acts in a category
    // Error codes: 200- ok, 204- no content, 405- method not allowed

});

// app.get('/api/v1/categories/{categoryName}/acts?start={startRange}&end = { endRange }', function (req, res) {
//     // Number of acts in a given range
//     // can check if prams are there in /api/v1/categories/:categoryName/acts , no need for seperate endpoint.
// });

app.post('/api/v1/acts/upvote', function (req, res) {
    // Upvote act
    // Error codes: 201- created, 400- bad request, 405- method not allowed

});

app.delete('/api/v1/acts/:actId', function (req, res) {
    // Remove act
    // Error codes: 200- ok, 400- bad request, 405- method not allowed

});

app.post('/api/v1/acts', function (req, res) {
    // Upload act
    // Error codes: 201- created, 400- bad request, 405- method not allowed

    var act = new Act ({
        _id: req.body.actId,
        username: req.body.username,
        actId: req.body.actId,
        timestamp: req.body.timestamp,
        caption: req.body.caption,
        category: req.body.category,
        imgB64: req.body.imgB64,
        upvotes: 0
    });
    
    Category.findOneAndUpdate({ _id: req.body.category }, { $push: { acts: act } }, (err, doc) => {
        if (err)
            res.status(400);
        else
            res.status(201);
        res.send({});
    });
});

app.listen(8000);
console.log("Server started");
