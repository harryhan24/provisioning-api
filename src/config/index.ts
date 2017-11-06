import databaseConfig from "./database";
import generalConfig from "./config";
import samlConfig from "./saml";
import adLdapConfig from "./adLdap";

const env = process.env.NODE_ENV || "development";

const config = generalConfig[env];
config.environment = env;
config.database = databaseConfig[env];
config.saml = samlConfig[env];
config.ad = adLdapConfig[env].ad;
config.ldap = adLdapConfig[env].ldap;

export default config;
