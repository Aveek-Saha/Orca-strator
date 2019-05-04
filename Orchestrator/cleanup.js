const Docker = require('dockerode');

var docker = new Docker(); 


docker.listContainers(function (err, containers) {
    containers.forEach(function (containerInfo) {
        docker.getContainer(containerInfo.Id).stop();
    });

    console.log("Cleaning up");
    
});