import { join } from "node:path"

process.loadEnvFile(join(import.meta.dirname, "..", ".env"));

const config = {
    hostname: process.env.HOSTNAME,
    port: process.env.PORT
};

export default config;