import { createServer } from "node:http"
import { join } from "node:path"
import config from "./config/config-env.js"
import LOG from "./logger/logger.js"
import app from "./app.js"

const { hostname, port } = config;

const server = createServer((request, response) => {
    app(request, response, LOG);
});

server.on('error', error => {
    LOG("ERROR", ` ${new Date().toLocaleString()}\n` + 
        `\t\t${error.message}`
    );
});

server.listen(port, hostname, () => {
    LOG("INFO", ` ${new Date().toLocaleString()}\n` +
        `\t\tServer is listening on port ${port}`, 
    
        { filePath: join(import.meta.dirname, "logs", "serverLogs.log") }
    )
});

/**
 * Single function to shutdown server and gracefully exit the
 * process.  
 * It is used for both SIGINT and SIGTERM.
 * 
 * @param signal
 *        Holds the type of SIGNAL that was use to terminate
 *        the process
 */
function shutdownServer(signal) {

    LOG("INFO",  ` ${new Date().toLocaleString()}\n` +
        `\t\tServer closing with SIGNAL: ${signal}`
    )

    server.close();
    process.exit(0);

}

process.on("SIGINT", signal => shutdownServer(signal));
process.on("SIGTERM", signal => shutdownServer(signal));
