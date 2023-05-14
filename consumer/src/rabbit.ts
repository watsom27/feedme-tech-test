import amqp, { Channel, ConsumeMessage } from "amqplib";

import { Message } from "../../library/src";
import { logInfo, logWarn } from "../../library/src/logger";
import { MongoService } from "./mongoService";

export class RabbitConsumerClient {
    private constructor(
        private channel: Channel,
        private queueName: string,
        private mongoService: MongoService,
    ) {
        channel.consume(this.queueName, this.handleMessage.bind(this));
    }

    public static async new(
        rabbitUrl: string,
        queueName: string,
        mongoService: MongoService,
    ): Promise<RabbitConsumerClient> {
        const connection = await amqp.connect(rabbitUrl);
        const channel = await connection.createChannel();
        await channel.assertQueue(queueName, { durable: true });
        channel.prefetch(1);

        return new RabbitConsumerClient(channel, queueName, mongoService);
    }

    private async handleMessage(msg: ConsumeMessage | null): Promise<void> {
        if (msg) {
            const message: Message = JSON.parse(msg.content.toString("utf8"));
            logInfo(`Message ${message.msgId} received.`);

            await this.mongoService.handleMessage(message);
            logInfo(`Message ${message.msgId} persisted to MongoDB`);

            this.channel.ack(msg);
        } else {
            logWarn("Got an empty message, hmm");
        }
    }
}
