# FeedMe Tech Test

## Components

### `reader`

This application connects to the TCP socket and parses the packets into JavaScript objects according to the provided schema.

These JavaScript objects represent new or updated Fixtures, Markets and Outcomes. These updates are then persisted into a MongoDB collection using `mongoService.ts`.

#### Technology Choices

For creating `reader`, I have used ts-node and TypeScript for development. Jest has been used for unit testing.
