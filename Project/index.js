const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const Docker = require('dockerode');
const app = express();


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: 'true', limit: '5mb' }));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.json({ type: 'application/vnd.api+json', limit: '5mb' }));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

var docker = new Docker(); 

// containers will contain obj in the format of {container,port}
var containers = [];

// docker.createContainer({
//     Image: 'acts',
//     "HostConfig": {
//         "PortBindings": {
//             "8000/tcp": [
//                 {
//                     "HostPort": "8080"
//                 }
//             ]
//         }
//     }
// }).then(function (container) {
//     return container.start();
// }).then(function (container) {
//     console.log(container);
    
//     return container;
// }).then(function (container) {
//     return container.stop();
// }).then(function (container) {
//     return container.remove();
// }).then(function (data) {
//     console.log('container removed');
// }).catch(function (err) {
//     console.log(err);
// });

function scaling(params) {
    
}

// Function to check health
// function healthCheck() {
//     axios.get('/api/v1/_health')
// }

// setInterval(healthCheck, 1000);





app.listen(8000);
console.log("Server started");
