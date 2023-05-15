import { Collection, MongoClient, WithId } from "mongodb";

import * as env from "~/service/env";
import { logWarn } from "~/service/Logger";

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
export type EventView = { eventId: string, category: string, name: string };
export type MarketView = {
    marketId: string,
    name: string,
    suspended: boolean,
    outcomes: {
        outcomeId: string,
        name: string,
        price: string,
        suspended: boolean,
    }[],
};

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

    public async getEventById(eventId: string): Promise<EventView | undefined> {
        const event = await this.getCollection().findOne({ eventId, displayed: true });

        return event
            ? { eventId: event.eventId, category: event.category, name: event.name }
            : undefined;
    }

    public async getEventsBySubcategory(category: string): Promise<Record<Subcategory, EventView[]>> {
        const events = await this.getCollection().find({ displayed: true, category }).toArray();

        const result: Record<Subcategory, EventView[]> = {};

        for (const event of events) {
            const view = {
                eventId: event.eventId,
                category: event.category,
                name: event.name,
            };

            if (result[event.subCategory]) {
                result[event.subCategory].push(view);
            } else {
                result[event.subCategory] = [view];
            }
        }

        return result;
    }

    public async getMarketsForEvent(eventId: string): Promise<MarketView[] | undefined> {
        const event = await this.getCollection().findOne({ displayed: true, eventId });
        let result;

        if (event) {
            const marketOutcomeMap = new Map<string, MarketView>();

            for (const market of event.markets) {
                if (market.displayed) {
                    marketOutcomeMap.set(market.marketId, {
                        marketId: market.marketId,
                        name: market.name,
                        suspended: market.suspended || event.suspended,
                        outcomes: [],
                    });
                }
            }

            for (const outcome of event.outcomes) {
                if (marketOutcomeMap.has(outcome.marketId)) {
                    if (outcome.displayed) {
                        marketOutcomeMap.get(outcome.marketId)!.outcomes.push({
                            outcomeId: outcome.outcomeId,
                            name: outcome.name,
                            price: outcome.price,
                            suspended: outcome.suspended,
                        });
                    }
                } else {
                    logWarn(
                        `Outcome ${outcome.outcomeId} does not have a matching displayed market (${outcome.marketId}).`,
                    );
                }
            }

            result = Array.from(marketOutcomeMap.values());
        }

        return result;
    }

    public async getRandomMarkets(eventCount: number): Promise<Array<[EventView, MarketView[]]>> {
        const collection = this.getCollection();
        let count = await collection.countDocuments();
        const result: Array<[EventView, MarketView[]]> = [];

        if (count > 0) {
            for (let i = 0; i < eventCount; i++) {
                // Random number between 0 and `count - 1`
                const random = Math.min(Math.round(Math.random() * count), count - 1);

                const event = await collection.find().limit(-1).skip(random).next();

                if (event) {
                    const eventView = {
                        eventId: event.eventId,
                        category: event.category,
                        name: event.name,
                    };

                    const markets = await this.getMarketsForEvent(event.eventId);

                    if (markets && markets.length) {
                        result.push([eventView, markets]);
                    } else {
                        eventCount++;
                    }
                }
            }
        }

        return result;
    }

    private getCollection(): Collection<EventDocument> {
        return this.client.db(this.database).collection<EventDocument>(FIXTURES_COLLECTION);
    }
}

export const mongoService = MongoService.new();
