import { Socket } from "net";

import { logError, logInfo, logWarn } from "../../library/src/logger";
import * as env from "./env";
import { parseMessages } from "./parser";
import { RabbitPublisherClient } from "./rabbit";

async function main() {
    logInfo("Connecting to socket", true);
    const socket = new Socket().connect({
        host: env.PROVIDER_HOSTNAME,
        port: env.PROVIDER_PORT,
    });

    socket.setEncoding("utf8");

    logInfo("Connecting to RabbitMQ", true);
    const rabbitClient = await RabbitPublisherClient.new(env.RABBITMQ_URL, env.JSON_MESSAGE_QUEUE);

    logInfo("Listening for packets...", true);

    socket.addListener("data", async (d) => {
        const messages = parseMessages(d.toString());

        for (const message of messages) {
            logInfo(message);
            rabbitClient.publishMessage(message);
        }
    });
}

main();
