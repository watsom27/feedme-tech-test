import { Collection, MongoClient } from "mongodb";

import { EventMessage, MarketMessage, Message, MessageType, Operation, OutcomeMessage } from "../../library/src";
import { exhaustive } from "./exhaustive";

const FIXTURES_COLLECTION = "Fixtures";

interface EventDocument {
    eventId: string;
    category: string;
    subCategory: string;
    name: string;
    startTime: number;
    displayed: boolean;
    suspended: boolean;
    markets: MarketDocument[];
    outcomes: OutcomeDocument[];
}

interface MarketDocument {
    eventId: string;
    marketId: string;
    name: string;
    displayed: boolean;
    suspended: boolean;
}

interface OutcomeDocument {
    marketId: string;
    outcomeId: string;
    name: string;
    price: string;
    displayed: boolean;
    suspended: boolean;
}

export class MongoService {
    constructor(private client: MongoClient, private database: string) {}

    public async handleMessage(message: Message): Promise<void> {
        const collection = this.client.db(this.database).collection<EventDocument>(FIXTURES_COLLECTION);

        switch (message.type) {
            case MessageType.Event:
                return this.handleEventMessage(collection, message);
            case MessageType.Market:
                return this.handleMarketMessage(collection, message);
            case MessageType.Outcome:
                return this.handleOutcomeMessage(collection, message);
            default:
                exhaustive(message);
        }
    }

    private async handleEventMessage(collection: Collection<EventDocument>, message: EventMessage): Promise<void> {
        if (message.operation === Operation.Create) {
            await collection.insertOne({
                eventId: message.eventId,
                category: message.category,
                subCategory: message.subCategory,
                name: message.name,
                startTime: message.startTime,
                displayed: message.displayed,
                suspended: message.suspended,
                markets: [],
                outcomes: [],
            });
        } else if (message.operation === Operation.Update) {
            await collection.updateOne({ eventId: message.eventId }, { $set: {
                category: message.category,
                subCategory: message.subCategory,
                name: message.name,
                startTime: message.startTime,
                displayed: message.displayed,
                suspended: message.suspended,
            } });
        } else {
            exhaustive(message.operation);
        }
    }

    private async handleMarketMessage(collection: Collection<EventDocument>, message: MarketMessage): Promise<void> {
        if (message.operation === Operation.Create) {
            await collection.updateOne({ eventId: message.eventId }, { $push: { markets: {
                eventId: message.eventId,
                marketId: message.marketId,
                name: message.name,
                displayed: message.displayed,
                suspended: message.suspended,
            } } });
        } else if (message.operation === Operation.Update) {
            await collection.updateOne({ eventId: message.eventId, "markets.marketId": message.marketId }, { $set: {
                "markets.$": {
                    eventId: message.eventId,
                    marketId: message.marketId,
                    name: message.name,
                    displayed: message.displayed,
                    suspended: message.suspended,
                },
            } });
        } else {
            exhaustive(message.operation);
        }
    }

    private async handleOutcomeMessage(collection: Collection<EventDocument>, message: OutcomeMessage): Promise<void> {
        if (message.operation === Operation.Create) {
            await collection.updateOne({ "markets.marketId": message.marketId }, { $push: {
                outcomes: {
                    marketId: message.marketId,
                    outcomeId: message.outcomeId,
                    name: message.name,
                    price: message.price,
                    displayed: message.displayed,
                    suspended: message.suspended,
                },
            } });
        } else if (message.operation === Operation.Update) {
            await collection.updateOne({ "outcomes.outcomeId": message.outcomeId }, { $set: {
                "outcomes.$": {
                    marketId: message.marketId,
                    outcomeId: message.outcomeId,
                    name: message.name,
                    price: message.price,
                    displayed: message.displayed,
                    suspended: message.suspended,
                    updated: true,
                },
            } });
        } else {
            exhaustive(message.operation);
        }
    }
}
