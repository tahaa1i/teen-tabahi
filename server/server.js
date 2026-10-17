import { createServer } from "node:http"
import { join } from "node:path"
import config from "./config/config-env.js"
import LOG from "./logger/logger.js"

const { hostname, port } = config;

const server = createServer();

server.on('error', error => LOG("ERROR", error.message));
server.listen(port, hostname, () => {
    LOG("INFO", "Server is listening", {
        filePath: join(import.meta.dirname, "logs", "logfile")
    })
});

function shutdownServer(signal) {
    server.close(() => {
        LOG("INFO", `Server closed with SIGNAL: ${signal}`)
    });

    process.exit(0);
}

process.on("SIGINT", signal => shutdownServer(signal));
process.on("SIGTERM", signal => shutdownServer(signal));
