import { beforeEach, describe, expect, test } from "@jest/globals";
import { Message, MessageType, Operation } from "../../library/src";

import { parseMessages } from "./parser";

const randomInputs: string[] = [
    "|4903|create|outcome|1683988990689|f7b72a5a-9db2-4723-843f-0d93652d72ae|883e26ec-b0d6-4569-8cc8-e269ddaf1f41|\\|Rochdale\\| 3-0|11/2|0|1|",
    "|4904|create|outcome|1683988990689|f7b72a5a-9db2-4723-843f-0d93652d72ae|69e3a8fc-bf07-432f-8932-caa3dccdcc34|Draw 2-2|4/7|0|1|",
    "|4905|create|outcome|1683988990689|f7b72a5a-9db2-4723-843f-0d93652d72ae|30d169df-3884-4959-bcce-9c3b9cbd25ae|\\|MK Dons\\| 0-3|6/5|0|1|",
    "|4906|create|market|1683988990689|eb6bf9a9-557e-4709-81d4-a572c6265bab|1641ccae-f05a-4904-9630-5fd1ff757d34|Goal Handicap (-1)|0|1|",
    "|4907|create|outcome|1683988990689|1641ccae-f05a-4904-9630-5fd1ff757d34|b458f826-cfff-4cb4-84ba-c3930af354fa|\\|Rochdale\\| -1|1/50|0|1|",
    "|4908|create|outcome|1683988990689|1641ccae-f05a-4904-9630-5fd1ff757d34|75c0b33d-5af5-420b-9778-5aaf2f5cd70b|Handicap Draw -1|1/3|0|1|",
    "|4909|create|outcome|1683988990689|1641ccae-f05a-4904-9630-5fd1ff757d34|c4bd96c4-0540-4c38-bcef-f66031ed409a|\\|MK Dons\\| +1|1/33|0|1|",
    "|4910|create|market|1683988990689|eb6bf9a9-557e-4709-81d4-a572c6265bab|80ae39d4-8b1e-4391-b40a-0512927bc3bd|Goal Handicap (-2)|0|1|",
    "|4911|create|outcome|1683988990689|80ae39d4-8b1e-4391-b40a-0512927bc3bd|c280551f-ef98-4e38-b02f-a5f950d47725|\\|Rochdale\\| -2|9/2|0|1|",
    "|4912|create|outcome|1683988990689|80ae39d4-8b1e-4391-b40a-0512927bc3bd|7a1a21e4-7df5-42f0-a282-7b8ce59272ad|Handicap Draw -2|10/3|0|1|",
    "|4913|create|outcome|1683988990690|80ae39d4-8b1e-4391-b40a-0512927bc3bd|bd9c17f9-5197-46e0-8e65-33e4058b89b7|\\|MK Dons\\| +2|5/2|0|1|",
    "|4914|create|market|1683988990690|eb6bf9a9-557e-4709-81d4-a572c6265bab|690bf8fe-102c-4d30-9f45-ba62d19c9e11|Goal Handicap (+1)|0|1|",
    "|4915|create|outcome|1683988990690|690bf8fe-102c-4d30-9f45-ba62d19c9e11|21f5bd82-7360-41d4-9ae4-d5fe71359c58|\\|Rochdale\\| +1|1/1|0|1|",
    "|4916|create|outcome|1683988990690|690bf8fe-102c-4d30-9f45-ba62d19c9e11|6904b704-8b67-4dc0-bea7-01876545fff8|Handicap Draw +1|1/16|0|1|",
    "|4917|create|outcome|1683988990690|690bf8fe-102c-4d30-9f45-ba62d19c9e11|79b12676-c75c-4a94-9800-26e166784fd0|\\|MK Dons\\| -1|1/33|0|1|",
    "|4918|create|market|1683988990690|eb6bf9a9-557e-4709-81d4-a572c6265bab|f653bd29-8f20-4786-baeb-a4f687cb6802|Goal Handicap (+2)|0|1|",
    "|4919|create|outcome|1683988990690|f653bd29-8f20-4786-baeb-a4f687cb6802|e499007c-cc2c-4822-9a07-a0b0881c5039|\\|Rochdale\\| +2|1/500|0|1|",
    "|4920|create|outcome|1683988990690|f653bd29-8f20-4786-baeb-a4f687cb6802|23c9fe35-dff6-44a9-9457-91cfe89e39e9|Handicap Draw +2|7/1|0|1|",
    "|4921|create|outcome|1683988990690|f653bd29-8f20-4786-baeb-a4f687cb6802|3fc113c8-aa2c-43bc-b487-e62295aec993|\\|MK Dons\\| -2|1/33|0|1|",
    "|4922|update|outcome|1683988990932|374ce230-a501-4232-a06f-87ce993271d5|09a69e0f-7272-482c-aa46-c8f88976688f|Yes|1/5|1|0|",
    "|4923|update|outcome|1683988990934|374ce230-a501-4232-a06f-87ce993271d5|214377d5-7d91-4f8d-9e35-e084f70c3d45|No|1/25|1|0|",
    "|4924|update|outcome|1683988991051|36b16307-9f52-4be8-9a00-377b46ba0030|91089ce1-edce-4ca8-810d-a104b5ee1ab5|\\|Wycombe\\| 1-0|25/1|1|0|",
    "|4925|update|outcome|1683988991052|36b16307-9f52-4be8-9a00-377b46ba0030|1bed0f0d-96d2-4482-bdcb-08941461601c|Draw 0-0|10/3|1|0|",
    "|4926|update|outcome|1683988991052|36b16307-9f52-4be8-9a00-377b46ba0030|85f2405e-116c-432b-a063-a0580a37d88b|\\|Notts County\\| 0-1|4/1|1|0|",
    "|4927|update|outcome|1683988991052|36b16307-9f52-4be8-9a00-377b46ba0030|26232415-8b4f-4cfc-824a-1cb5a98a4c5c|\\|Wycombe\\| 2-0|9/2|1|0|",
    "|4928|update|outcome|1683988991053|36b16307-9f52-4be8-9a00-377b46ba0030|9d9249a6-8a62-4255-a6eb-8e9654ff76b2|Draw 1-1|10/1|1|0|",
    "|4929|update|outcome|1683988991053|36b16307-9f52-4be8-9a00-377b46ba0030|a7df2ccb-994a-479c-af95-88a07263704c|\\|Notts County\\| 0-2|8/11|1|0|",
    "|4930|update|outcome|1683988991054|36b16307-9f52-4be8-9a00-377b46ba0030|9e7c887b-708b-47ee-a958-fa53bb71fc72|\\|Wycombe\\| 3-0|20/1|1|0|",
];

type ParseTestDatum = {
    description: string,
    input: string,
    expected: Message,
};

/** If I were writing this for production, this array would be populated with more examples and edge cases. But for the sake of brevity i've left it at these */
const parseTestData: ParseTestDatum[] = [
    {
        description: "Update Outcome - No Escaped Pipes",
        input:
            "|4925|update|outcome|1683988991052|36b16307-9f52-4be8-9a00-377b46ba0030|1bed0f0d-96d2-4482-bdcb-08941461601c|Draw 0-0|10/3|1|0|",
        expected: {
            msgId: 4925,
            operation: Operation.Update,
            type: MessageType.Outcome,
            timestamp: 1683988991052,
            marketId: "36b16307-9f52-4be8-9a00-377b46ba0030",
            outcomeId: "1bed0f0d-96d2-4482-bdcb-08941461601c",
            name: "Draw 0-0",
            price: "10/3",
            displayed: true,
            suspended: false,
        },
    },
    {
        description: "Update Outcome - With Escaped Pipes",
        input:
            "|4926|update|outcome|1683988991052|36b16307-9f52-4be8-9a00-377b46ba0030|85f2405e-116c-432b-a063-a0580a37d88b|\\|Notts County\\| 0-1|4/1|1|0|",
        expected: {
            msgId: 4926,
            operation: Operation.Update,
            type: MessageType.Outcome,
            timestamp: 1683988991052,
            marketId: "36b16307-9f52-4be8-9a00-377b46ba0030",
            outcomeId: "85f2405e-116c-432b-a063-a0580a37d88b",
            name: "\\|Notts County\\| 0-1",
            price: "4/1",
            displayed: true,
            suspended: false,
        },
    },
    {
        description: "Create Market - No Escaped Pipes",
        input:
            "|4910|create|market|1683988990689|eb6bf9a9-557e-4709-81d4-a572c6265bab|80ae39d4-8b1e-4391-b40a-0512927bc3bd|Goal Handicap (-2)|0|1|",
        expected: {
            msgId: 4910,
            operation: Operation.Create,
            type: MessageType.Market,
            timestamp: 1683988990689,
            eventId: "eb6bf9a9-557e-4709-81d4-a572c6265bab",
            marketId: "80ae39d4-8b1e-4391-b40a-0512927bc3bd",
            name: "Goal Handicap (-2)",
            displayed: false,
            suspended: true,
        },
    },
];

type InvalidMessageHandlingDatum = {
    description: string,
    input: string[],
    expected: Message[],
};

const invalidMessageHandlingData: InvalidMessageHandlingDatum[] = [{
    description: "",
    input: [
        "|4925|update|outcome|1683988991052|36b16307-9f52-4be8-9a00-377b46ba0030|1bed0f0d-96d2-4482-bdcb-08941461601c|Draw 0-0|10/3|1|0|",
        "|4907|create|invalidtype|1683988990689|1641ccae-f05a-4904-9630-5fd1ff757d34|b458f826-cfff-4cb4-84ba-c3930af354fa|\\|Rochdale\\| -1|1/50|0|1|",
        "|4926|update|outcome|1683988991052|36b16307-9f52-4be8-9a00-377b46ba0030|85f2405e-116c-432b-a063-a0580a37d88b|\\|Notts County\\| 0-1|4/1|1|0|",
    ],
    expected: [{
        msgId: 4925,
        operation: Operation.Update,
        type: MessageType.Outcome,
        timestamp: 1683988991052,
        marketId: "36b16307-9f52-4be8-9a00-377b46ba0030",
        outcomeId: "1bed0f0d-96d2-4482-bdcb-08941461601c",
        name: "Draw 0-0",
        price: "10/3",
        displayed: true,
        suspended: false,
    }, {
        msgId: 4926,
        operation: Operation.Update,
        type: MessageType.Outcome,
        timestamp: 1683988991052,
        marketId: "36b16307-9f52-4be8-9a00-377b46ba0030",
        outcomeId: "85f2405e-116c-432b-a063-a0580a37d88b",
        name: "\\|Notts County\\| 0-1",
        price: "4/1",
        displayed: true,
        suspended: false,
    }],
}];

describe("Message Parser", () => {
    test("Should not skip any messages", () => {
        const parseResult = parseMessages(randomInputs.join("\n"));

        expect(parseResult.length).toBe(randomInputs.length);
    });

    describe("Valid Message Parsing", () => {
        for (const { description, input, expected } of parseTestData) {
            test(description, () => {
                const parseResult = parseMessages(input);

                expect(parseResult).toEqual([expected]);
            });
        }
    });

    describe("Invalid Message Handling", () => {
        beforeEach(() => {
            // The logger currently logs to the console, this is to prevent spam in the test output.
            console.error = () => undefined;
        });

        for (const { description, input, expected } of invalidMessageHandlingData) {
            test(description, () => {
                const parseResult = parseMessages(input.join("\n"));

                expect(parseResult).toEqual(expected);
            });
        }
    });
});
