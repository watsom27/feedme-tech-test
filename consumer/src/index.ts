import { MongoClient } from "mongodb";

import * as env from "./env";
import { logInfo } from "./logger";
import { MongoService } from "./mongoService";
import { RabbitConsumerClient } from "./rabbit";

async function main() {
    logInfo("Connecting to MongoDB", true);
    const mongoClient = new MongoClient(env.NOSQL_CONNECTION_STRING);
    await mongoClient.connect();
    const mongoService = new MongoService(mongoClient, env.NOSQL_DB_NAME);

    logInfo("Connecting to RabbitMQ", true);
    await RabbitConsumerClient.new(env.RABBITMQ_URL, env.JSON_MESSAGE_QUEUE, mongoService);

    logInfo("Listening for Messages...", true);
}

main();
