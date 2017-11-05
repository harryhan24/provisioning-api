// @flow
import ldap from "ldapjs";
import logger from "./logger";

/**
 * A wrapper around the "ldapjs" object to make it easier to use
 */
export default class Ldap {
  client: any;
  bound: boolean;

  baseDn: string;
  user: string;
  password: string;

  constructor(url: string, baseDn: string, user: string, password: string) {
    this.client = ldap.createClient({ url });
    this.bound = false;

    this.baseDn = baseDn;
    this.user = user;
    this.password = password;
  }

  async bind() {
    if (!this.bound) {
      await new Promise(resolve => {
        this.client.bind(this.user, this.password, () => {
          resolve();
          this.bound = true;
        });
      });
    }

    return true;
  }

  async search(filter: string, attributes: Array<string>): Promise<any> {
    await this.bind();

    // Setup options
    const options = {
      scope: "sub",
      filter,
      attributes,
    };
    const results = [];
    return new Promise((resolve, reject) => {
      this.client.search(this.baseDn, options, (error, res) => {
        if (error) {
          reject(new Error(`Search failed with message: ${error.message}`));
        }

        res
          .on("searchEntry", entry =>
            results.push(Ldap.cleanLdapEntry(entry.object)),
          )
          .on("error", resError =>
            reject(new Error(`Search error: ${resError}`)),
          )
          .on("end", () => resolve(results));
      });
    });
  }

  async searchFirst(filter: string, attributes: Array<string>): Promise<any> {
    try {
      const results = await this.search(filter, attributes);
      return results instanceof Array && results.length > 0 ? results[0] : null;
    } catch (e) {
      logger.log("error", `[Ldap] Search failed with error: ${e.message}`);
      return null;
    }
  }

  static cleanLdapEntry = o => {
    if (o instanceof Array) return o.map(Ldap.cleanLdapEntry);

    const attributes = {};
    Object.entries(o)
      .filter(([key]) => key !== "controls")
      .forEach(([key, value]: any) => {
        let parsedValue: any = value;
        if (value === "true") parsedValue = true;
        if (value === "false") parsedValue = false;
        if (/^(-|\+)?\d+$/.test(value)) parsedValue = parseInt(value, 10);

        attributes[key] = parsedValue;
      });

    return attributes;
  };
}
