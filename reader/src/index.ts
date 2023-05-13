import { MongoClient } from "mongodb";
import { Socket } from "net";

import * as env from "./env";
import { logInfo } from "./logger";
import { MongoService } from "./mongoService";
import { parseMessages } from "./parser";

async function main() {
    const socket = new Socket().connect({
        host: env.PROVIDER_HOSTNAME,
        port: env.PROVIDER_PORT,
    });

    const mongoClient = new MongoClient(env.NOSQL_CONNECTION_STRING);
    await mongoClient.connect();

    const mongoService = new MongoService(mongoClient, env.NOSQL_DB_NAME);

    socket.setEncoding("utf8");

    socket.addListener("data", async (d) => {
        const messages = parseMessages(d.toString());

        for (const message of messages) {
            logInfo(message);
            await mongoService.handleMessage(message);
        }
    });
}

main();
