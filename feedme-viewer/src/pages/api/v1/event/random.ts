import type { NextApiRequest, NextApiResponse } from "next";

import { mongoService } from "~/service/MongoService";

const DEFAULT_LIMIT = 2;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const { method, query } = req;

    switch (method) {
        case "GET":
            const ms = await mongoService;

            const parsedLimit = query.limit && !Array.isArray(query.limit) ? parseInt(query.limit) : undefined;
            const limit = parsedLimit && !isNaN(parsedLimit) ? parsedLimit : DEFAULT_LIMIT;

            const markets = await (await mongoService).getRandomMarkets(limit);

            res.send(markets);

            break;

        default:
            res.setHeader("Allow", ["GET"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
