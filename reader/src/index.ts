import { Socket } from "net";

import { logInfo } from "./logger";
import { parseMessages } from "./parser";

function main() {
    const socket = new Socket().connect({
        host: process.env.PROVIDER_HOSTNAME,
        port: Number.parseInt(process.env.PROVIDER_PORT!, 10),
    });

    socket.setEncoding("utf8");

    socket.addListener("data", (d) => {
        parseMessages(d.toString()).forEach(logInfo);
    });
}

main();
