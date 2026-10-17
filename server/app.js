import { readFile } from "node:fs/promises"
import { join } from "node:path"

/**
 * It carries complete functionality of handling all the requests comming to the server.
 * 
 * @param request
 *        HTTP request object.
 * 
 * @param response
 *        HTTP response object.
 * 
 * @param LOG
 *        Logger function that server is using to write logs.
 * 
 * @returns
 *        Server responses.
 */
export default async function app(request, response, LOG) {
    const { httpVersion, method, url } = request;

    // Ignore all the (favicon.ico)'s
    if (url.includes("favicon.ico")) {    
        response.end();
        return;
    }
    
    LOG("INFO", ` ${new Date().toLocaleString()}\n` +
        `\t\tServer receives request.\n` +
        `\t\tRequest: '${method}\t${url}\tHTTP/${httpVersion}'`
    );
    
    // Create filePath to find absolute filePath
    let filePath;
    if (url === "/" || url === "/home" || url === "/index")
        filePath = "index.html";
    else
        filePath = url; 

    // Create Absoulte filePath
    const absoulteFilePath = join(
        import.meta.dirname, '..', filePath
    );

    // Fetch content if the content exists

    let content;

    try {

        content = await readFile(absoulteFilePath);
        response.writeHead(200, 'OK');
    
    } catch (error) {
    
        LOG("ERROR", ` ${new Date().toLocaleString()}\n` +
            `\t\t${error.message}\n` + 
            `\t\tServer cannot fulfill request.\n` + 
            `\t\tRequest: '${method}\t${url}\tHTTP/${httpVersion}'`
        );

        content = "Content Not Found";        
        response.writeHead(400, 'Bad Request');
    
    } finally {
        // Return response to the client
        response.end(content);
    }
}
