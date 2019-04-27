const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const Docker = require('dockerode');
const httpProxy = require('http-proxy');
// const http = require('http');
// const proxy = require('http-proxy-middleware');
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
var acts_url = "http://3.209.208.104"
// containers will contain obj in the format of {container,port,resolving}
var containers = [];

var ports = ['8010', '8009', '8008', '8007', '8006', '8005', '8004', '8003', '8002', '8001', '8000' ]

var i = 0;
var scale_count = 0;
var total_count = 0


function addInstance() {
    free_port = ports.pop()

    docker.createContainer({
        Image: 'acts',
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
        console.log("Container Started on port: " + free_port);

        containers.push({"container": container, "port": free_port, "resolving": false});

        console.log("Number of running containers: " + containers.length);

        return container;
    }).catch(function (err) {
        console.log(err);
    });
}

function removeInstance(cont) {
    cont.container.stop()
        .then(function (data) {
            containers.splice(containers.findIndex(function (i) {
                return i.port == cont.port;
            }), 1);

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

    if (scale_count < 20) { 
        if (len == 1) return;
        else if (len > 1) {
            for (let j = 1; j < len; j++) {
                removeInstance(containers[j]);
            }
        }
        else if (len < 1) {
            addInstance();
        }
    }
    else if (scale_count >= 20 && scale_count < 40) {
        var num = 2;
        if (len == num) return;
        else if (len > num) {
            for (let j = 0; j < len - num; j++) {
                removeInstance(containers[j]);
            }
        }
        else if (len < num) {
            for (let j = 0; j < num - len; j++) {
                addInstance();
            }
        }
    }
    // else if (scale_count >= 40 && scale_count < 60) { 
    //     var num = 3;
    //     if (len == num) return;
    //     else if (len > num) {
    //         for (let j = 0; j < len - num; j++) {
    //             removeInstance(containers[j]);
    //         }
    //     }
    //     else if (len < num) {
    //         for (let j = 0; j < num - len; j++) {
    //             addInstance();
    //         }
    //     }
    // }
    // else if (scale_count >= 60 && scale_count < 80) { 
    //     var num = 4;
    //     if (len == num) return;
    //     else if (len > num) {
    //         for (let j = 0; j < len - num; j++) {
    //             removeInstance(containers[j]);
    //         }
    //     }
    //     else if (len < num) {
    //         for (let j = 0; j < num - len; j++) {
    //             addInstance();
    //         }
    //     }
    // }
    // else if (scale_count >= 80 && scale_count < 100) { 
    //     var num = 5;
    //     if (len == num) return;
    //     else if (len > num) {
    //         for (let j = 0; j < len - num; j++) {
    //             removeInstance(containers[j]);
    //         }
    //     }
    //     else if (len < num) {
    //         for (let j = 0; j < num - len; j++) {
    //             addInstance();
    //         }
    //     }
    // }
    // else if (scale_count >= 100 && scale_count < 120) { 
    //     var num = 6;
    //     if (len == num) return;
    //     else if (len > num) {
    //         for (let j = 0; j < len - num; j++) {
    //             removeInstance(containers[j]);
    //         }
    //     }
    //     else if (len < num) {
    //         for (let j = 0; j < num - len; j++) {
    //             addInstance();
    //         }
    //     }
    // }
    // else if (scale_count >= 120 && scale_count < 140) { 
    //     var num = 7;
    //     if (len == num) return;
    //     else if (len > num) {
    //         for (let j = 0; j < len - num; j++) {
    //             removeInstance(containers[j]);
    //         }
    //     }
    //     else if (len < num) {
    //         for (let j = 0; j < num - len; j++) {
    //             addInstance();
    //         }
    //     }
    // }
    // else if (scale_count >= 140 && scale_count < 160) { 
    //     var num = 8;
    //     if (len == num) return;
    //     else if (len > num) {
    //         for (let j = 0; j < len - num; j++) {
    //             removeInstance(containers[j]);
    //         }
    //     }
    //     else if (len < num) {
    //         for (let j = 0; j < num - len; j++) {
    //             addInstance();
    //         }
    //     }
    // }
    // else if (scale_count >= 160 && scale_count < 180) { 
    //     var num = 9;
    //     if (len == num) return;
    //     else if (len > num) {
    //         for (let j = 0; j < len - num; j++) {
    //             removeInstance(containers[j]);
    //         }
    //     }
    //     else if (len < num) {
    //         for (let j = 0; j < num - len; j++) {
    //             addInstance();
    //         }
    //     }
    // }
    // else if (scale_count >= 180 && scale_count < 200) { 
    //     var num = 10;
    //     if (len == num) return;
    //     else if (len > num) {
    //         for (let j = 0; j < len - num; j++) {
    //             removeInstance(containers[j]);
    //         }
    //     }
    //     else if (len < num) {
    //         for (let j = 0; j < num - len; j++) {
    //             addInstance();
    //         }
    //     }
    // }
    
    scale_count = 0;
    
}

function restartInstance(cont) {
    cont.resolving = true;

    cont.container.stop()
        .then(function (data) {
            containers.splice(containers.findIndex(function (i) {
                return i.port == cont.port;
            }), 1);

            console.log("Container stopped on port: " + cont.port);
            console.log("Number of running containers: " + containers.length);

            ports.push(cont.port);

            addInstance();

        })
}

// Function to check health
function healthCheck() {
    

    containers.forEach(cont => {
        axios.get(acts_url + ":" + cont.port + '/api/v1/_health' )
            .then(function (response) {
                // console.log(cont.port + ": OK");

            })
            .catch(function (error) {
                // error.code == "ECONNRESET" 
                if (cont.resolving == false && error.response.status >= 500) {
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

// var server = http.createServer(function (req, res) {

//     console.log(total_count)
//     proxy.web(req, res, { target: acts_url + ':' + containers[i]['port']});

//     total_count++;
//     if (total_count == 1){
//         setInterval(scaling, 2*60*1000);
//     }

//     i = (i + 1) % containers.length;
//     scale_count++;
// });

app.get("/api/*", function (req, res) {

    console.log("Request " + scale_count + " Num-containers: " + containers.length + "    i= " + scale_count % containers.length)
    i = scale_count % containers.length;

    console.log(" Sent to: " + containers[i]);
    
    proxy.web(req, res, { target: acts_url + ':' + containers[i]['port'] });

    total_count++;
    if (total_count == 1) {
        setInterval(healthCheck, 10 * 1000);
        setInterval(scaling, 2 * 60 * 1000);
    }

    scale_count++;
});

// server.listen(8080);
app.listen(8080);

console.log("Server started");
