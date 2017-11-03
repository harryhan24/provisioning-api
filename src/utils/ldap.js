// @flow
import ldap from "ldapjs";

const cleanLdapEntry = o => {
  if (o instanceof Array) return o.map(cleanLdapEntry);

  const attributes = {};
  Object.entries(o)
    .filter(([key]) => key !== "controls")
    .forEach(([key: string, value: string]) => {
      let parsedValue: any = value;
      if (value === "true") parsedValue = true;
      if (value === "false") parsedValue = false;
      if (/^(-|\+)?\d+$/.test(value)) parsedValue = parseInt(value, 10);

      attributes[key] = parsedValue;
    });

  return attributes;
};

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

  async search(filter: string, attributes: Array<string>) {
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
          reject(`Search failed with message: ${error.message}`);
        }

        return res
          .on("searchEntry", entry =>
            results.push(cleanLdapEntry(entry.object)),
          )
          .on("error", resError => reject(`Search error: ${resError}`))
          .on("end", () => resolve(results));
      });
    });
  }

  async searchFirst(filter: string, attributes: Array<string>) {
    try {
      const results = await this.search(filter, attributes);
      return results[0];
    } catch (e) {
      return null;
    }
  }
}
