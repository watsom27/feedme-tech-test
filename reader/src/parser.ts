import { exhaustive } from "./exhaustive";
import { logError } from "./logger";

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

type Part = string;

const TERMINATOR = "\n";
const DELIMITER = "|";
const ESCAPE_CHAR = "\\";
const TYPE_INDEX = 2;

const HEADER_MAPPING = ["msgId", "operation", "type", "timestamp"];

const PART_MAPPING: Record<MessageType, string[]> = {
    [MessageType.Event]: [
        ...HEADER_MAPPING,
        "eventId",
        "category",
        "subCategory",
        "name",
        "startTime",
        "displayed",
        "suspended",
    ],
    [MessageType.Market]: [
        ...HEADER_MAPPING,
        "eventId",
        "marketId",
        "name",
        "displayed",
        "suspended",
    ],
    [MessageType.Outcome]: [
        ...HEADER_MAPPING,
        "marketId",
        "outcomeId",
        "name",
        "price",
        "displayed",
        "suspended",
    ],
};

const BOOLEAN_COLUMNS = ["displayed", "suspended"];
const NUMBER_COLUMNS = ["msgId", "timestamp"];

function parseMessage(input: Part[]): Message | undefined {
    const type = input[TYPE_INDEX];

    switch (type) {
        case MessageType.Event:
        case MessageType.Market:
        case MessageType.Outcome:
            const result: any = {};
            const mapping = PART_MAPPING[type];

            for (let i = 0; i < input.length; i++) {
                const key = mapping[i];
                const value = input[i];

                if (BOOLEAN_COLUMNS.includes(key)) {
                    result[key] = Boolean(parseInt(value, 10));
                } else if (NUMBER_COLUMNS.includes(key)) {
                    result[key] = parseInt(value, 10);
                } else {
                    result[key] = value;
                }
            }

            return result;

        default:
            logError(`Unknown Message Type: ${type}`);
            return;
    }
}

/**
 * Parse messages from an input string.
 *
 * Invalid messages will be skipped and a message logged.
 */
export function parseMessages(input: string): Message[] {
    const chars = input.split("");
    const messages: Message[] = [];
    const parts: Part[] = [];

    const firstChar = chars.shift();

    if (firstChar && firstChar === DELIMITER) {
        let previousChar;
        let currentPart;

        currentPart = [];
        previousChar = firstChar;

        for (const char of chars) {
            if (char === DELIMITER && previousChar !== ESCAPE_CHAR) {
                if (previousChar !== TERMINATOR) {
                    parts.push(currentPart.join(""));
                    currentPart.length = 0;
                }
            } else if (char === TERMINATOR && previousChar === DELIMITER) {
                const parsedMessage = parseMessage(parts);

                if (parsedMessage) {
                    messages.push(parsedMessage);
                }

                parts.length = 0;
            } else {
                currentPart.push(char);
            }

            previousChar = char;
        }

        /// Catch the last message leftover if it is not terminated by a newline
        if (parts.length > 0 && previousChar === DELIMITER) {
            const parsedMessage = parseMessage(parts);

            if (parsedMessage) {
                messages.push(parsedMessage);
            }
        }
    }

    return messages;
}
