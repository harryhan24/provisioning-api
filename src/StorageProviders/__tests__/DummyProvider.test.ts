import QueueService from "../../services/QueueService";
import logger from "../../utils/logger";
import { TYPE_NEW_ALLOCATION_DUMMY } from "../../jobs/types";
import DummyProvider from "../DummyProvider";
import { Allocation } from "../../database/models";

jest.mock("../../services/QueueService");

describe("The DummyProvider -> queueCreationJob function", () => {
  test("should resolve as false if the QueueService fails to send a message", done => {
    const error = new Error("a");
    QueueService.sendMessage.mockImplementationOnce(() => {
      throw error;
    });
    const allocation = { get: jest.fn(() => ({ id: 1 })) };
    const dummyProvider = new DummyProvider();
    dummyProvider.queueCreationJob(allocation).then(res => {
      expect(res).toBe(false);
      expect(QueueService.sendMessage).toHaveBeenCalledWith(TYPE_NEW_ALLOCATION_DUMMY, { id: 1 });
      expect(logger.error).toHaveBeenCalledWith(`[DummyProvider] Could not queue creation job`, {
        error,
        allocation: { id: 1 },
      });
      done();
    });
  });

  test("should send a message via the QueueService with the right data", done => {
    QueueService.sendMessage.mockReturnValueOnce(true);
    const allocation = { get: jest.fn(() => ({ id: 1 })) };
    const dummyProvider = new DummyProvider();
    dummyProvider.queueCreationJob(allocation).then(res => {
      expect(res).toBe(true);
      expect(QueueService.sendMessage).toHaveBeenCalledWith(TYPE_NEW_ALLOCATION_DUMMY, { id: 1 });
      done();
    });
  });
});

describe("The DummyProvider -> requestStorage function", () => {
  test("should handle sequelize errors", done => {
    const allocation = {
      set: jest.fn(),
      save: jest.fn(() => {
        throw new Error("some_error");
      }),
      get: jest.fn(),
    };
    allocation.get.mockReturnValueOnce("all");
    const dummyProvider = new DummyProvider();
    dummyProvider.requestStorage(allocation).then(res => {
      expect(res).toBe(false);
      expect(allocation.set).toHaveBeenCalledWith("status", Allocation.STATUS_STORAGE_PROVIDED);
      expect(allocation.save).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledWith("[DummyProvider] Could not set allocation to STORAGE_PROVIDED", {
        allocation: "all",
        error: "some_error",
      });
      done();
    });
  });

  test("should handle a successful save", done => {
    const allocation = {
      set: jest.fn(),
      save: jest.fn(),
    };
    const dummyProvider = new DummyProvider();
    dummyProvider.requestStorage(allocation).then(res => {
      expect(res).toBe(true);
      expect(allocation.set).toHaveBeenCalledWith("status", Allocation.STATUS_STORAGE_PROVIDED);
      expect(allocation.save).toHaveBeenCalled();
      done();
    });
  });
});
