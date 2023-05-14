import { Collection, MongoClient, WithId } from "mongodb";

import * as env from "~/service/env";

export const FIXTURES_COLLECTION = "Fixtures";

export interface EventDocument {
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

export interface MarketDocument {
    eventId: string;
    marketId: string;
    name: string;
    displayed: boolean;
    suspended: boolean;
}

export interface OutcomeDocument {
    marketId: string;
    outcomeId: string;
    name: string;
    price: string;
    displayed: boolean;
    suspended: boolean;
}

export type Subcategory = string;
export type EventName = string;

class MongoService {
    private constructor(
        private client: MongoClient,
        private database: string,
    ) {}

    public static async new(): Promise<MongoService> {
        const mongoClient = new MongoClient(env.NOSQL_CONNECTION_STRING);
        await mongoClient.connect();

        return new MongoService(mongoClient, env.NOSQL_DB_NAME);
    }

    public async getCategories(): Promise<string[]> {
        return this.getCollection().distinct("category", { displayed: true });
    }

    public async getEventsBySubcategory(category: string): Promise<Record<Subcategory, EventName[]>> {
        const events = await this.getCollection().find({ displayed: true, category }).toArray();

        const result: Record<Subcategory, EventName[]> = {};

        for (const event of events) {
            if (result[event.subCategory]) {
                result[event.subCategory].push(event.name);
            } else {
                result[event.subCategory] = [event.name];
            }
        }

        return result;
    }

    private getCollection(): Collection<EventDocument> {
        return this.client.db(this.database).collection<EventDocument>(FIXTURES_COLLECTION);
    }
}

export const mongoService = MongoService.new();
