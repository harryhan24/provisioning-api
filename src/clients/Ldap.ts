import Ldap from "../utils/ldap";
import config from "../config";

class LdapClient {
  client: Ldap;

  constructor() {
    this.client = new Ldap(config.ldap.url, config.ldap.base, config.ldap.dn, config.ldap.password);
  }

  async getOrcidByUsername(username: string) {
    const attributes = ["orcid"];
    const filter = `(uid=${username})`;
    const fields = await this.client.searchFirst(filter, attributes);

    return fields && fields.orcid ? fields.orcid : null;
  }
}

export default new LdapClient();
