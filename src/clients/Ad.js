// @flow
import Ldap from "../utils/ldap";
import config from "../config";

let adClient = null;
const getAdClient = () => {
  if (adClient === null) {
    adClient = new Ldap(
      config.ad.url,
      config.ad.base,
      config.ad.dn,
      config.ad.password,
    );
  }
  return adClient;
};

export default {
  async searchByUsername(username: string) {
    const attributes = [
      "sAMAccountName",
      "mail",
      "displayName",
      "givenName",
      "sn",
    ];
    const filter = `(&(sAMAccountName=${username})(objectClass=user))`;
    const fields = await getAdClient().searchFirst(filter, attributes);

    return fields !== null ? this.renameFields(fields) : fields;
  },
  renameFields(fields: {
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
  },
};
