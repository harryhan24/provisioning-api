import "jest";

import logger from "../../utils/logger";
import AllocationService from "../AllocationService";
import { JOB_TYPE_NEW_ALLOCATION } from "../../jobs/types";

jest.mock("../QueueService");

const { Allocation, Project } = require.requireMock("../../database/models");

const QueueService = require.requireMock("../QueueService").default;

describe("The AllocationService -> createAllocation function", () => {
  test("should create an allocation with the given parameters", done => {
    const project = { id: 1, hasHumanData: false, hasHumanIdentifiableData: false, hasHpcRequirement: true };
    Allocation.create.mockReturnValueOnce({ id: 123 });
    QueueService.sendMessage.mockReturnValueOnce(true);

    AllocationService.createAllocation(project, "dummy").then(response => {
      expect(response).toEqual({ id: 123 });
      expect(QueueService.sendMessage).toHaveBeenCalledWith(JOB_TYPE_NEW_ALLOCATION, { id: 123 });
      done();
    });
  });

  test("should handle an error from the QueueService", done => {
    const project = { id: 1, hasHumanData: false, hasHumanIdentifiableData: false, hasHpcRequirement: true };
    const error = new Error("OOOOoooooooOOOOoooOooooo");
    Allocation.create.mockReturnValueOnce({ id: 123 });
    QueueService.sendMessage.mockImplementationOnce(() => {
      throw error;
    });

    AllocationService.createAllocation(project, "dummy").then(response => {
      expect(response).toEqual({ id: 123 });
      expect(QueueService.sendMessage).toHaveBeenCalled();
      expect(
        logger.error,
      ).toHaveBeenCalledWith(
        "[AllocationService] Could not create QUEUE message for new allocation. Allocation will have to be manually picked up.",
        { error },
      );
      done();
    });
  });
});
