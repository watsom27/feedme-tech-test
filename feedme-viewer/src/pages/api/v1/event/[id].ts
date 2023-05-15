import type { NextApiRequest, NextApiResponse } from "next";

import { mongoService } from "~/service/MongoService";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const { method, query } = req;

    switch (method) {
        case "GET":
            const eventId = query.id;

            if (eventId && !Array.isArray(eventId)) {
                const ms = await mongoService;

                res.send(await ms.getMarketsForEvent(eventId));
            } else {
                res.status(400);
                res.end("EventId is missing or malformed.");
            }

            break;

        default:
            res.setHeader("Allow", ["GET"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
