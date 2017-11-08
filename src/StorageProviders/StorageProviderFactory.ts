import StorageProviderInterface from "./StorageProviderInterface";
import DummyProvider from "./DummyProvider";
import { STORAGE_TYPE_DUMMY } from "./types";

export default class StorageProviderFactory {
  static getStorageProviderInstance(type: string): StorageProviderInterface {
    switch (type) {
      case STORAGE_TYPE_DUMMY:
        return new DummyProvider();
      default:
        throw new Error("Could not find storage provider");
    }
  }
}
