// @flow
import config from "../config";
import Fetch from "../utils/Fetch";

class IdentityProviderApi {
  client: Fetch;

  constructor() {
    this.client = new Fetch(config.idpApi.baseUri, {});
  }

  _tokenLookup(token: string) {
    return this.client.get(`token/${token}`);
  }

  async findAafTokenByUsername(username: string) {
    try {
      const userDetails = await this._tokenLookup(username);
      return userDetails.auEduPersonSharedToken;
    } catch (e) {
      // TODO: Error logging
      return null;
    }
  }
}

let instance = null;
export default (): IdentityProviderApi => {
  if (instance === null) {
    instance = new IdentityProviderApi();
  }
  return instance;
};
