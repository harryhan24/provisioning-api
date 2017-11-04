const env = process.env.NODE_ENV || "development";

const config = require("./config.json")[env];
const databaseConfig = require("./database.json")[env];
const samlConfig = require("./saml.json")[env];
const adLdapConfig = require("./adLdap.json")[env];

config.environment = process.env.NODE_ENV;
config.database = databaseConfig;
config.saml = samlConfig;
config.ad = adLdapConfig.ad;
config.ldap = adLdapConfig.ldap;

export default config;
