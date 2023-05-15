import type { NextApiRequest, NextApiResponse } from "next";

import { mongoService } from "~/service/MongoService";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const { method, query } = req;

    switch (method) {
        case "GET":
            const category = query.category;

            if (category && !Array.isArray(category)) {
                const ms = await mongoService;

                res.send(await ms.getEventsBySubcategory(category));
            } else {
                res.status(400);
                res.end("Category is missing or malformed.");
            }

            break;

        default:
            res.setHeader("Allow", ["GET"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
