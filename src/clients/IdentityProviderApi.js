// @flow
import config from "../config";
import Fetch from "../utils/Fetch";
import logger from "../utils/logger";

class IdentityProviderApi {
  client: Fetch;

  constructor() {
    this.client = new Fetch(config.idpApi.baseUri, {});
  }

  tokenLookup(token: string) {
    return this.client.get(`token/${token}`);
  }

  async findAafTokenByUsername(username: string) {
    try {
      const userDetails = await this.tokenLookup(username);
      return userDetails.auEduPersonSharedToken;
    } catch (e) {
      logger.log(
        "error",
        `Could not get complete "auEduPersonSharedToken" lookup: ${e.message}`,
      );
      return null;
    }
  }
}

export default new IdentityProviderApi();
