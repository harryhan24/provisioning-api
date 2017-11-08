import DummyProvider from "../DummyProvider";
import StorageProviderFactory from "../StorageProviderFactory";

import { STORAGE_TYPE_DUMMY } from "../types";

jest.mock("../DummyProvider");

describe("The StorageProviderFactory -> getStorageProviderInstance", () => {
  test(`should handle the '${STORAGE_TYPE_DUMMY}' provider type`, () => {
    expect(StorageProviderFactory.getStorageProviderInstance(STORAGE_TYPE_DUMMY)).toBeInstanceOf(DummyProvider);
  });

  test("Should throw an error if the type is not found", () => {
    expect(() => StorageProviderFactory.getStorageProviderInstance("blalbla")).toThrow("Could not find storage provider");
  });
});
