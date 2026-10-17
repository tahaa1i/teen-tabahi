import { join } from "node:path"

/**
 * Testing the common cases of the logger
 */
function TEST_LOG() {

    // Initalization cases
    LOG("INFO", "Initializing a Writable Stream for Logger", {
        filePath: join(import.meta.dirname, '..', 'logs', 'logfile')
    });

    // Writing log after initializing it.
    LOG("INFO", "Hey! It's the first log.");

    // Closing the stream
    LOG("INFO", "Closing the logger's stream", { closeStream: true });

    // Initializing logger again
    LOG("INFO", "Initializing a Writable Stream for Logger for server", {
        filePath: join(import.meta.dirname, '..', 'logs', 'logServer')
    });

    // Change stream path case
    LOG("INFO", "Initializing a Writable Stream for Logger", {
        filePath: join(import.meta.dirname, '..', 'logs', 'logServer'),
        changeFilePath: true
    });

    // Error Cases
    LOG("", "", { changeFilePath: true });

}

TEST_LOG();
