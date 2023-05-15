# FeedMe Tech Test

## Running The Stack

All elements of this tech test can be spun up inside docker containers. 

I have provided a Dockerfile for each service, a shell script to simplify building the images (`build_docker_images.sh`), and have updated the `docker-compose.yml` to include these services.

To build and run the stack in docker:

```bash
./build_docker_images.sh
docker compose up
```

Note: the `reader` and `consumer` containers are configured to wait for `rabbitmq` to pass healthchecks before starting. 

## Components

### `reader`

This application connects to the TCP socket and parses the packets into JavaScript objects according to the provided schema.

These JavaScript objects represent new or updated Fixtures, Markets and Outcomes. 
These updates are then published to a RabbitMQ via `RabbitPublisherClient.publishMessage` which takes a parsed `Message`, JSON serialises it and then pushing it to Rabbit.

`RabbitPublisherClient` uses a private constructor to allow the creation of a static async `constructor` - `new`. This was done to simplify initialisation of the client.

The URL of the rabbit vhost and the name of the queue are configurable using environment variables, along with the hostname and port of the TCP Provider.

### `consumer`

This application connects to the RabbitMQ queue and consumes JSON encoded `Message`s via `RabbitConsumerClient`.
On receiving a `Message` it is JSON parsed and then persisted into MongoDB via `MongoService`, and then the message is acknowledged.

The consumer is set up to only receive one message at a time. This, along with the manual acknowledgement once `MongoService.handleMessage` has completed ensure messages are not missed and are share equally between consumers.

Multiple consumers can be spun up as required.

## Technology Choices

I have used ts-node and TypeScript for development. Jest has been used for unit testing.

RabbitMQ has been used for message queueing.

### Dockerfiles

The dockerfiles for `reader` and `consumer` both build from a `base` dockerfile that contains `ts-node` and the common `library` package.
