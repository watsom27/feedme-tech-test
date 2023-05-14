import amqp, { Channel } from "amqplib";

import { Message } from "../../library/src";
import { logInfo } from "../../library/src/logger";

export class RabbitPublisherClient {
    private constructor(private channel: Channel, private queueName: string) {}

    public static async new(rabbitUrl: string, queueName: string): Promise<RabbitPublisherClient> {
        const connection = await amqp.connect(rabbitUrl);
        const channel = await connection.createChannel();
        await channel.assertQueue(queueName, { durable: true });

        return new RabbitPublisherClient(channel, queueName);
    }

    public publishMessage(message: Message) {
        this.channel.sendToQueue(this.queueName, Buffer.from(JSON.stringify(message)));

        logInfo(`Message ${message.msgId} published.`);
    }
}
