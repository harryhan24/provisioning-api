const env = process.env.NODE_ENV || "development";
const config = require("./config.json")[env];
const databaseConfig = require("./database.json")[env];

config.database = databaseConfig;

export default config;
