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

app.get('/', function (req, res) {
    res.render('index.html');
});


app.post('/api/v1/users', function (req, res) {
    // Add User
    // Error codes: 201- created, 400- bad request, 405- method not allowed

    User.find({ username: req.body.username}, (err, users) =>{
        if(users.length == 0){
            User.create({
                username: req.body.username,
                password: req.body.password
            }, (err, c) => {
                if (err)
                    res.status(400);
                else
                    res.status(201);
            });
        }
        else
            res.status(400)
        res.send({});
    });
});

app.delete('/api/v1/users/:username', function (req, res) {
    // Remove user
    // Error codes: 200- ok, 400- bad request, 405- method not allowed

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
        Category.find({ name: cat }, (err, cats) => {
            if(cats.length == 0){
                Category.create({
                    count: 0,
                    name: cat
                }, (err, c) => {
                    if (err)
                        res.status(400);
                    else
                        res.status(201);
                });
            }
            else
                res.status(400);
        });
        
    });
    res.send({})
});

app.delete('/api/v1/categories/:categoryName', function (req, res) {
    // Remove a category
    // Error codes: 200- ok, 400- bad request, 405- method not allowed

    Category.deleteOne({ name: req.params.categoryName }, function (err) {
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

    Category.find({ name: req.params.categoryName }, (err, cats) => {
        if (cats.length != 0) {
            if (req.query.start == null || req.query.end == null) {
                Act.find({ category: req.params.categoryName }, (err, acts) => {
                    if (err){
                        res.status(400);
                        res.send({});
                    }
                    else if (acts.length > 500){
                        res.status(413);
                        res.send({});
                    }
                    else if (acts.length == 0) {
                        res.status(204);
                        res.send([]);
                    }
                    else {
                        var arr = []
                        acts.forEach(act => {
                            arr.push({
                                actId: act.actId,
                                username: act.username,
                                timestamp: act.timestamp,
                                caption: act.caption,
                                upvotes: act.upvotes,
                                imgB64: act.imgB64
                            })
                        })
                        res.status(200);
                        res.send(arr);
                        
                    }
                })
            }
            else {

                

                res.status(400);
                res.send(req.query.start);
            }
        }
        else {
            res.status(400);
            res.send(req.query.start);
            
        }
    });

    

});

app.get('/api/v1/categories/:categoryName/acts/size', function (req, res) {
    // Number of acts in a category
    // Error codes: 200- ok, 204- no content, 405- method not allowed

    Category.find({ name: req.params.categoryName }, (err, cat) => {
        if (err)
            res.status(400);
        else {
            if (cat.length == 0) {
                res.status(400);
                res.send({});
            }
            else {
                counts = [cat[0].count];
                res.status(200).send(counts);
            }

        }
    });

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
    var id = parseInt(req.params.actId)
    // console.log(id);

    Act.findOneAndDelete({ actId: id }, (err, act) => {
        if (err || !act)
            res.status(400);
        else{

            Category.find({ name: act.category }, (err, cats) => {
                if (cats.length == 0)
                    res.status(400);
                else {
                    Category.findOneAndUpdate({ name: act.category }, { $set: { count: cats[0].count - 1 } }, (err, doc, ca) => {
                        if (err)
                            res.status(400);
                        else
                            res.status(201);
                    })
                }
            })

        }
        res.send({})
    });

});

app.post('/api/v1/acts', function (req, res) {
    // Upload act
    // Error codes: 201- created, 400- bad request, 405- method not allowed

    Act.find({ actId: req.body.actId}, (err, act) => {
        if(act.length == 0){

            User.find({ username: req.body.username}, (err, users) =>{
                if (users.length == 0)
                    res.status(400);
                else{
                    Category.find({ name: req.body.category }, (err, cats) => {
                        if (cats.length == 0)
                            res.status(400);
                        else{
                            // if (Buffer.from(req.body.imgB64, 'base64').toString('base64') === req.body.imgB64)
                            // console.log(Buffer.from(req.body.imgB64, 'base64').toString('base64') === req.body.imgB64);
                            
                            Act.create({
                                username: req.body.username,
                                actId: req.body.actId,
                                timestamp: req.body.timestamp,
                                caption: req.body.caption,
                                category: req.body.category,
                                imgB64: req.body.imgB64,
                                upvotes: 0
                            }, (err, c) => {
                                if (err)
                                    res.status(400);
                                else{
                                    // res.status(201);
                                
                                    Category.findOneAndUpdate({ name: req.body.category }, { $set: { count: cats[0].count+1 } }, (err, doc, ca) => {
                                        if (err)
                                            res.status(400);
                                        else 
                                            res.status(201);
                                    })
                                }
                            });
                        }
                    })
                }
            })

        }
        else
            res.status(400);
        res.send({})        
    });
});

app.listen(8000);
console.log("Server started");
