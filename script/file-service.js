const { join } = require("path");
const getFullPath = (dir, file) => join(__dirname, ".." , dir, file);

const { readFile } = require("fs").promises;

async function getText(Path) {
    try {
        return await readFile(Path, "utf-8");
    } catch (error) {
        return undefined;
    }
};

async function getImage(Path) {
    try {
        // For binary (images) no encoding i.e.(utf-8, ascii, etc) is needed
        return await readFile(Path);
    } catch (error) {
        return undefined;
    }
}

module.exports = { getFullPath, getImage, getText };
