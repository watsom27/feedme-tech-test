# FeedMe Tech Test

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

### `library`

`library` is a small package containing code that is shared between `reader` and `consumer`. 

I had originally wanted to set this project up using `npm` workspaces, however I couldn't get it working with typescript and didn't want to commit too much time to it.

I also tried installing `libary` as a `file: ` dependency in `reader` and `consumer`, but this broke the unit tests in `reader` so I went back on this.

## Technology Choices

I have used ts-node and TypeScript for development. Jest has been used for unit testing.

RabbitMQ has been used for message queueing.
