// @flow
import Ldap from "../utils/ldap";
import config from "../config";

let ldapClient = null;
const getLdapClient = () => {
  if (ldapClient === null) {
    ldapClient = new Ldap(
      config.ldap.url,
      config.ldap.base,
      config.ldap.dn,
      config.ldap.password,
    );
  }
  return ldapClient;
};

export default {
  async getOrcidByUsername(username: string) {
    const attributes = ["orcid"];
    const filter = `(uid=${username})`;
    const fields = await getLdapClient().searchFirst(filter, attributes);

    return fields.orcid || null;
  },
};
