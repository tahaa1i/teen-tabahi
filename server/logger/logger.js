import { createWriteStream } from "node:fs"

/** 
 * An internal file variable use to hold writable streams for logs.
 */
let __logsStream = undefined;

/** 
 * A simple logging function that provides general functionality
 * for logging purpose.
 * 
 * @param level 
 *        Indicates what is the log's type.
 * 
 * @example "info" || "error"
 * 
 * @param message 
 *        Logging message. Contains all information about a log.
 * 
 * @param options
 *        Useful options that enables the true general
 *        functionality of the logger.
 * 
 * @param options.filePath
 *        Holds the path to create a writable stream or to
 *        change the existing writable stream.
 * 
 * @param options.changeFilePath
 *        Indicates the logger change the existing stream path.  
 *        It is important to be true; otherwise streams's path 
 *        wouldn't change.
 * 
 * @param options.closeStream
 *        Indicates the logger to close a the file path and
 *        writable stream.
 * 
 * @Note By Default the logger is set to write logs.
 */
export default function LOG(level, message, options = {
    filePath: undefined,
    changeFilePath: false,
    closeStream: false,
}) {
    const { filePath, changeFilePath, closeStream } = options;

    if (!__logsStream && !filePath) {

        const error = new Error("filePath not provided to logger");
        console.error({
            Error: error.message
        });

    } else if (!filePath && changeFilePath) {

        const error = new Error("Invalid options: Changed filePath not provided to logger");
        console.error({
            Error: error.message 
        });

    } 
    
    if ((!__logsStream && filePath) || (__logsStream && filePath && changeFilePath)) {

        __logsStream = createWriteStream(filePath, {
            encoding: "utf8",
            flags: 'a' 
        });

        __logsStream.write(`[${level}] ${message}\n`);

    } else if (__logsStream) {

        (closeStream) 
          ?  __logsStream.end(`[${level}] ${message}\n`)
          :  __logsStream.write(`[${level}] ${message}\n`);

    }
}
