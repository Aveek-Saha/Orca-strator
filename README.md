# Container Orchestration System for a Scalable API
An Orchestration System for a containerised API broken into microservices.

Features a generic orchestrator that can be used with any application based on custom scaling and health checking rules.

# Orchestration features:

## Fault tolerance :
Every 2 seconds, the orchestrator engine polls the health check API of each running Acts
container. On detecting an unhealthy container, it restarts that container on the same
port.

## Auto Scaling:
The orchestrator keeps a track of the number of incoming HTTP requests in the past two
minutes. At every 2 minute interval, depending on how many requests were received, the
orchestrator increases or decreases the number of containers.

## Load Balancing:
The round robin scheduling algorithm, that we have used to distribute requests, is a
scheduling algorithm where each process is assigned a fixed time slot in a cyclic way.
