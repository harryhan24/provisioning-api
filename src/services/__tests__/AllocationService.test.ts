import "jest";

import logger from "../../utils/logger";
import AllocationService from "../AllocationService";
import { TYPE_NEW_ALLOCATION_DUMMY } from "../../jobs/types";
import StorageProviderFactory from "../../StorageProviders/StorageProviderFactory";

jest.mock("../../StorageProviders/StorageProviderFactory");

const { Allocation, Project } = require.requireMock("../../database/models");

describe("The AllocationService -> createAllocation function", () => {
  test("should create an allocation with the given parameters and queue a creation job", done => {
    const project = { id: 1, hasHumanData: false, hasHumanIdentifiableData: false, hasHpcRequirement: true };
    Allocation.create.mockReturnValueOnce({ id: 123 });
    const fakeProvider = { queueCreationJob: jest.fn() };
    StorageProviderFactory.getStorageProviderInstance.mockReturnValueOnce(fakeProvider);

    AllocationService.createAllocation(project, "dummy").then(response => {
      expect(response).toEqual({ id: 123 });
      expect(StorageProviderFactory.getStorageProviderInstance).toHaveBeenCalledWith("dummy");
      expect(fakeProvider.queueCreationJob).toHaveBeenCalled();
      done();
    });
  });
});
