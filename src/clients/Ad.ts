import Ldap from "../utils/ldap";
import config from "../config";

const attributes = ["sAMAccountName", "mail", "displayName", "givenName", "sn"];

class AdClient {
  client: Ldap;

  constructor() {
    this.client = new Ldap(config.ad.url, config.ad.base, config.ad.dn, config.ad.password);
  }

  async searchByUsername(username: string) {
    const filter = `(&(sAMAccountName=${username})(objectClass=user))`;
    const fields = await this.client.searchFirst(filter, attributes);
    return fields !== null ? AdClient.renameFields(fields) : fields;
  }

  async findAccounts(searchToken: string) {
    const filter = `(&(objectClass=user)(|(sAMAccountName=*${searchToken}*)(mail=*${searchToken}*)))`;
    const fields = await this.client.search(filter, attributes);
    return fields !== null ? fields.map(AdClient.renameFields) : fields;
  }

  static renameFields(fields: { sAMAccountName: string; givenName: string; sn: string; displayName: string; mail: string }) {
    return {
      username: fields.sAMAccountName,
      firstName: fields.givenName,
      surname: fields.sn,
      displayName: fields.displayName,
      mail: fields.mail,
    };
  }
}

export default new AdClient();
