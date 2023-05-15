import type { NextApiRequest, NextApiResponse } from "next";

import { mongoService } from "~/service/MongoService";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const { method } = req;

    switch (method) {
        case "GET":
            const ms = await mongoService;

            res.send(await ms.getCategories());

            break;

        default:
            res.setHeader("Allow", ["GET"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
