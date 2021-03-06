const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
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
var crashed = false;

app.get('/api/v1/_health', function (req, res) {
    // Get number of requests
    // Error codes: 200- ok, 405- method not allowed

    if(crashed){
        res.status(500)
        res.send();
        return;
    }

    res.status(200)
    res.send();

});

app.post('/api/v1/_crash', function (req, res) {
    // Get number of requests
    // Error codes: 200- ok, 405- method not allowed

    if (crashed) {
        res.status(500)
        res.send();
        return;
    }

    crashed = true;

    res.status(200)
    res.send();

});

app.get('/api/v1/_count', function (req, res) {
    // Get number of requests
    // Error codes: 200- ok, 405- method not allowed

    res.status(200)
    res.send([count]);

});

app.delete('/api/v1/_count', function (req, res) {
    // Get number of requests
    // Error codes: 200- ok, 405- method not allowed

    if (crashed) {
        res.status(500)
        res.send();
        return;
    }

    count = 0;
    res.status(200)
    res.send({});

});

app.get('/api/v1/categories', function (req, res) {
    // Lsit all categories
    // Error codes: 200- ok, 204- no content, 405- method not allowed

    if (crashed) {
        res.status(500)
        res.send();
        return;
    }
    
    count++;

    Category.find({}, (err, cats) => {
        if (err)
            res.status(400);
        else{
            var arr = {};
            if(cats.length == 0) {
                res.status(204).send({});
            }
            else {
                cats.forEach(cat => {
                    arr[cat.name] = cat.count;
                })
                res.status(200).send(arr);
            }
        }
    });
});

app.post('/api/v1/categories', function (req, res) {
    // Add a category
    // Error codes: 201- created, 400- bad request, 405- method not allowed

    if (crashed) {
        res.status(500)
        res.send();
        return;
    }

    count++;

    var cat = req.body[0];
    // req.body.forEach(cat => {
        Category.find({ name: cat }, (err, cats) => {
            if(cats.length == 0){
                Category.create({
                    count: 0,
                    name: cat
                }, (err, c) => {
                    if (err){
                        res.status(400);
                        res.send()

                    }
                    else{
                        res.status(201);
                        res.send({})

                    }
                });
            }
            else{
                res.status(400);
                res.send()
            }
        });
        
    // });
    // res.send({})
});

app.route('/api/v1/categories')
    .delete((req, res) => { res.status(405).send() })

app.delete('/api/v1/categories/:categoryName', function (req, res) {
    // Remove a category
    // Error codes: 200- ok, 400- bad request, 405- method not allowed

    if (crashed) {
        res.status(500)
        res.send();
        return;
    }

    count++;

    Category.find({ name: req.params.categoryName }, (err, cats) => {
        if(cats.length == 0)
            res.status(400);
        else{
            Act.deleteMany({ category: req.params.categoryName}, (err) => {
                if (err)
                    res.status(400);
                else {
                    Category.deleteOne({ name: req.params.categoryName }, function (err) {
                        if (err)
                            res.status(400);
                        else
                            res.status(200);
                    });
                }
            })
        }
        res.send({})
    })
});

app.route('/api/v1/categories/:categoryName')
    .get((req, res) => { res.status(405).send() })
    .post((req, res) => { res.status(405).send() })
    .put((req, res) => { res.status(405).send() })

app.get('/api/v1/categories/:categoryName/acts', function (req, res) {
    // List acts in a category < 500
    // Error codes: 200- ok, 204- no content, 405- method not allowed, 413- payload too large

    if (crashed) {
        res.status(500)
        res.send();
        return;
    }

    count++;

    Category.find({ name: req.params.categoryName }, (err, cats) => {
        if (cats.length != 0) {
            if (req.query.start == null || req.query.end == null) {
                Act.find({ category: req.params.categoryName }, (err, acts) => {
                    if (err){
                        res.status(400);
                        res.send();
                    }
                    else if (acts.length > 100){
                        res.status(413);
                        res.send();
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
                // res.status(400);
                // res.send(req.query.start);

                Act.find({ category: req.params.categoryName }, (err, acts) => {
                    if (err || parseInt(req.query.end) - parseInt(req.query.start) > acts.length
                        || parseInt(req.query.start) > acts.length || parseInt(req.query.end) > acts.length) {
                        res.status(400);
                        res.send();
                    }
                    else if (parseInt(req.query.end) - parseInt(req.query.start) > 100) {
                        res.status(413);
                        res.send();
                    }
                    else if (acts.length == 0) {
                        res.status(204);
                        res.send([]);
                    }
                    else {
                        var arr = []
                        acts.reverse().slice(parseInt(req.query.start)-1,  parseInt(req.query.end))
                        .forEach(act => {
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
        }
        else {
            res.status(400);
            res.send();
        }
    });
});

app.route('/api/v1/categories/:categoryName/acts')
    .delete((req, res) => { res.status(405).send() })
    .post((req, res) => { res.status(405).send() })
    .put((req, res) => { res.status(405).send() })

app.get('/api/v1/categories/:categoryName/acts/size', function (req, res) {
    // Number of acts in a category
    // Error codes: 200- ok, 204- no content, 405- method not allowed

    if (crashed) {
        res.status(500)
        res.send();
        return;
    }

    count++;

    Category.find({ name: req.params.categoryName }, (err, cat) => {
        if (err){
            res.status(400);
            res.send();
        }
        else {
            if (cat.length == 0) {
                res.status(400);
                res.send();
            }
            else {
                counts = [cat[0].count];
                res.status(200).send(counts);
            }

        }

    });

});

app.route('/api/v1/categories/:categoryName/acts/size')
    .delete((req, res) => { res.status(405).send() })
    .post((req, res) => { res.status(405).send() })
    .put((req, res) => { res.status(405).send() })

// app.get('/api/v1/categories/{categoryName}/acts?start={startRange}&end = { endRange }', function (req, res) {
//     // Number of acts in a given range
//     // can check if prams are there in /api/v1/categories/:categoryName/acts , no need for seperate endpoint.
// });

app.post('/api/v1/acts/upvote', function (req, res) {
    // Upvote act
    // Error codes: 201- created, 400- bad request, 405- method not allowed

    if (crashed) {
        res.status(500)
        res.send();
        return;
    }

    count++;

    Act.find({ actId: req.body[0] }, (err, acts) => {
        if (err) {
            res.status(400);
        }
        else {
            if (acts.length == 0) {
                res.status(400);
            }
            else {
                Act.findOneAndUpdate({ actId: req.body[0] }, { $set: { upvotes: acts[0].upvotes + 1 } }, (err, doc, ca) => {
                    if (err)
                        res.status(400);
                    else
                        res.status(201);
                });
            }
        }
        res.send({})
    });

});

app.route('/api/v1/acts/upvote')
    .delete((req, res) => { res.status(405).send() })
    .get((req, res) => { res.status(405).send() })
    .put((req, res) => { res.status(405).send() })

app.delete('/api/v1/acts/:actId', function (req, res) {
    // Remove act
    // Error codes: 200- ok, 400- bad request, 405- method not allowed

    if (crashed) {
        res.status(500)
        res.send();
        return;
    }

    count++;

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
                            res.status(200);
                    })
                }
            })

        }
        res.send({})
    });

});

app.route('/api/v1/acts/:actId')
    .post((req, res) => { res.status(405).send() })
    .put((req, res) => { res.status(405).send() })


app.get('/api/v1/acts/count', function (req, res) {
    // Get number of acts
    // Error codes: 200- ok, 405- method not allowed
    // console.log(req.body);

    if (crashed) {
        res.status(500)
        res.send();
        return;
    }

    count++;

    Act.find({}, (err, acts) => {
        res.status(200);
        res.send([acts.length]);
    });
});

app.post('/api/v1/acts', function (req, res) {
    // Upload act
    // Error codes: 201- created, 400- bad request, 405- method not allowed

    if (crashed) {
        res.status(500)
        res.send();
        return;
    }

    count++;

    Act.find({ actId: req.body.actId}, (err, act) => {
        if(act.length == 0){

            // Use Users microservice
            // Ip addr for Users: 3.82.39.172

            axios.get('http://3.82.39.172/api/v1/users')
            // axios.get('http://3.82.39.172:8080/api/v1/users')
                .then(function (response) {
                    let users = response.data
                    console.log(users.indexOf(req.body.username));
                    
                    if (users.length == 0) {
			console.log("Length users 0");
                        res.status(400);
                        res.send();
                    }
                    else if (users.indexOf(req.body.username) == -1){
			console.log("User Not found");
                        res.status(400);
                        res.send();
                    }
                    else {
                        Category.find({ name: req.body.categoryName }, (err, cats) => {
                            if (cats.length == 0) {
				console.log("Category Not found");
                                res.status(400);
                                res.send();
                            }
                            else {
// if (/^([0-9]{2}-[0-9]{2}-[0-9]{4}:[0-9]{2}-[0-9]{2}-[0-9]{2}$)/.test(req.body.timestamp) && req.body.upvotes == null && /^[a-zA-Z0-9]*==$/.test(req.body.imgB64))
                                if (true) {

                                    Act.create({
                                        username: req.body.username,
                                        actId: req.body.actId,
                                        timestamp: req.body.timestamp,
                                        caption: req.body.caption,
                                        category: req.body.categoryName,
                                        imgB64: req.body.imgB64,
                                        upvotes: 0
                                    }, (err, c) => {
                                        if (err) {
					console.log("Database error");
                                            res.status(400);
                                            res.send();
                                        }
                                        else {
                                            Category.findOneAndUpdate({ name: req.body.categoryName }, { $set: { count: cats[0].count + 1 } }, (err, doc, ca) => {
                                                if (err) {
						console.log("Search error");
                                                    res.status(400);
                                                    res.send();
                                                }
                                                else {
                                                    res.status(201);
                                                    res.send({});
                                                }
                                            })
                                        }
                                    });
                                }
                                else {
				console.log("Error 2");
                                    res.status(400);
                                    res.send();
                                }
                            }
                        })
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    
                    res.status(400);
                    res.send(); 
                });
        }
        else{
console.log(" error1");
            res.status(400);
            res.send();          
        }
    });
});

app.route('/api/v1/acts/:actId')
    .delete((req, res) => { res.status(405).send() })
    .put((req, res) => { res.status(405).send() })

app.get('/api/v1/acts', function (req, res) {
    // Get all acts
    // Error codes: 201- created, 400- bad request, 405- method not allowed

    // Act.find({}, (err, acts) => {
    //     res.send(acts)
    // });
    res.status(405).send()
});

app.route('/api/v1/acts')
    .delete((req, res) => { res.status(405).send() })
    .put((req, res) => { res.status(405).send() })

app.get('/api/v1/acts/upvote/:actId', function (req, res) {
    // Get Upvotes for an act
    // Error codes: 201- created, 400- bad request, 405- method not allowed

    var id = parseInt(req.params.actId)

    Act.find({ actId: id }, (err, acts) => {
        if (err) {
            res.status(400);
            res.send("Cannot able")
        }
        else {
            if (acts.length == 0) {
                res.status(400);
                res.send("Cannot able")
            }
            else {
                res.send({
                    upvotes: acts[0].upvotes
                })
            }
        }
    });
});

app.listen(8000);
console.log("Server started");
