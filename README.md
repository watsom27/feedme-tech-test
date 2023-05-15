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

### `feedme-viewer`

_Visible at [http://localhost](http://localhost) when the stack is running in docker._

This application is a NextJS web application that reads from the MongoDB database populated by `reader` and `consumer` and presents this information in a user-friendly way.

Any data with `displayed: false` is ignored and cannot be seen by the user. If an event, market, or outcome is marked as `suspended: true`, then the child outcomes are shown, but cannot be selected by the user.

React has been used for the UI, and for styling I have used CSS Modules. The styling is based off the Sky Bet website.

The next features I would implement is some form of client-side store for the users Bet Slip. This would then allow users to populate the bet slip using the buttons on the event's page. After this I would look into user login and account functionality, along with placing of bets.

Note: When first starting the stack, the MongoDB is empty, so the UI won't be able to show much until it is populated with events/markets/outcomes that have `displayed` set to `true`.

## Technology Choices

I have used ts-node and TypeScript for development on `reader` and `consumer`, `feedme-viewer` uses Typescript and NextJS.

Where unit testing has been done, Jest has been used.

RabbitMQ has been used for message queueing. This was selected as I have more experience with RabbitMQ than Kafka.

MongoDB was used as the NoSQL database, as suggested by the `docker-compose.yml` file.

### Dockerfiles

The dockerfiles for `reader` and `consumer` both build from a `base` dockerfile that contains `ts-node` and the common `library` package.
