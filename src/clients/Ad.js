// @flow
import Ldap from "../utils/ldap";
import config from "../config";

class AdClient {
  client: Ldap;

  constructor() {
    this.client = new Ldap(
      config.ad.url,
      config.ad.base,
      config.ad.dn,
      config.ad.password,
    );
  }

  async searchByUsername(username: string) {
    const attributes = [
      "sAMAccountName",
      "mail",
      "displayName",
      "givenName",
      "sn",
    ];

    const filter = `(&(sAMAccountName=${username})(objectClass=user))`;
    const fields = await this.client.searchFirst(filter, attributes);
    return fields !== null ? AdClient.renameFields(fields) : fields;
  }

  static renameFields(fields: {
    sAMAccountName: string,
    givenName: string,
    sn: string,
    displayName: string,
    mail: string,
  }) {
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
