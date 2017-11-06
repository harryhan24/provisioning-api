export default class Fetch {
  baseUri: string;
  headers: {};

  constructor(baseUri: string, headers: {} = {}) {
    this.baseUri = baseUri;
    this.headers = headers;
  }

  async get(path: string) {
    const uri = this.baseUri + path;
    try {
      const response = await fetch(uri);
      return await response.json();
    } catch (e) {
      throw e;
    }
  }
}
