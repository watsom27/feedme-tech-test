export enum Operation {
    Create = "create",
    Update = "update",
}

export enum MessageType {
    Event = "event",
    Market = "market",
    Outcome = "outcome",
}

export type EventMessage = {
    msgId: number,
    operation: Operation,
    type: MessageType.Event,
    timestamp: number,

    eventId: string,
    category: string,
    subCategory: string,
    name: string,
    startTime: number,
    displayed: boolean,
    suspended: boolean,
};

export type MarketMessage = {
    msgId: number,
    operation: Operation,
    type: MessageType.Market,
    timestamp: number,

    eventId: string,
    marketId: string,
    name: string,
    displayed: boolean,
    suspended: boolean,
};

export type OutcomeMessage = {
    msgId: number,
    operation: Operation,
    type: MessageType.Outcome,
    timestamp: number,

    marketId: string,
    outcomeId: string,
    name: string,
    price: string,
    displayed: boolean,
    suspended: boolean,
};

export type Message =
    | EventMessage
    | MarketMessage
    | OutcomeMessage;
