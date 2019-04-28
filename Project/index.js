const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const Docker = require('dockerode');
const httpProxy = require('http-proxy');
const fs = require('fs')

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

let config = JSON.parse(fs.readFileSync('config.json', 'utf-8'))
// var acts_url = config.url;
var scale_req = config.scale_req;
var max_scale = config.max_scale;
var scale_interval = config.scale_interval;
var health_interval = config.health_interval;
var image_name = config.image_name;

var docker = new Docker();
var acts_url = "http://3.209.208.104"

// containers will contain obj in the format of {container,port,resolving}
var containers = [];

var ports = [];
for (let i = 0; i < max_scale; i++)
    ports.unshift((8000 + i).toString())
console.log(ports);

var i = 0;
var scale_count = 0;
var total_count = 0


function addInstance() {
    let free_port = ports.pop()

    docker.createContainer({
        Image: image_name,
        "HostConfig": {
            "PortBindings": {
                "8000/tcp": [
                    {
                        "HostPort": free_port
                    }
                ]
            }
        }
    }).then(function (container) {
        return container.start();
    }).then(function (container) {
        containers.push({ "container": container, "port": free_port, "resolving": false });

        console.log("Container Started on port: " + free_port);
        console.log("Number of running containers: " + containers.length);
        containers.sort((a, b) => (parseInt(a.port) > parseInt(b.port)) ? 1 : -1);

        return container;
    }).catch(function (err) {
        console.log(err);
    });
}

function removeInstance(cont) {
	containers.splice(containers.findIndex(function (i) {
                return i.port == cont.port;
            }), 1);
    cont.container.stop()
        .then(function (data) {
            

            console.log("Container stopped on port: " + cont.port);
            console.log("Number of running containers: " + containers.length);

            ports.push(cont.port);
            // i = (i + 1) % containers.length;
        })

}



// There should be 1 instance running
addInstance();

function scaling() {

    var len = containers.length;
    var num = Math.floor(scale_count / scale_req) + 1;

    if (scale_count < scale_req) {
        if (len == 1) return;
        else if (len > 1) {
            for (let j = len - 1; j > 0; j--) {
                // removeInstance(containers[j]);
            }
        }
        else if (len < 1) {
            addInstance();
        }
    }
    else if (num > max_scale) {
        if (len == max_scale) return;
        else if (len < max_scale) {
            for (let j = 0; j < max_scale; j++) {
                addInstance();
            }
        }
    }
    else {
        if (len == num) return;
        else if (len > num) {
            for (let j = len - 1; j > num - 1; j--) {
                removeInstance(containers[j]);
            }
        }
        else if (len < num) {
            for (let j = 0; j < num - len; j++) {
                addInstance();
            }
        }
    }

    scale_count = 0;

}

function restartInstance(cont) {
    cont.resolving = true;

    containers.splice(containers.findIndex(function (i) {
        return i.port == cont.port;
    }), 1);

    cont.container.stop()
        .then(function (data) {

            console.log("Container stopped on port: " + cont.port);
            console.log("Number of running containers: " + containers.length);

            ports.push(cont.port);

            addInstance();

        })
}

// Function to check health
function healthCheck() {


    containers.forEach(cont => {
        axios.get(acts_url + ":" + cont.port + '/api/v1/_health')
            .then(function (response) {
                // console.log(cont.port + ": OK");

            })
            .catch(function (error) {
                // error.code == "ECONNRESET" 
		console.log(error.code);
		console.log(error.config.url);
		// && error.response.status >= 500
                if (cont.resolving == false ) {
                    console.log(error.response.status);

                    restartInstance(cont)

                }
            })
            .catch(function (error) {
                // console.log(error);

            });

    })

}


var proxy = httpProxy.createProxyServer({})
    .on('error', function (e) {
        console.log(JSON.stringify(e, null, ' '))
    });

app.get("/api/*", function (req, res) {

    console.log("Request " + scale_count + " Num-containers: " + containers.length + "    i= " + scale_count % containers.length)
    i = scale_count % containers.length;

    console.log(req.url +" Sent to: " + containers[i].port);

    proxy.web(req, res, { target: acts_url + ':' + containers[i]['port'] });

    total_count++;
    if (total_count == 1) {
        setInterval(healthCheck, health_interval);
        setInterval(scaling, scale_interval);
    }

    scale_count++;
});

// server.listen(8080);
app.listen(80);

console.log("Server started");
