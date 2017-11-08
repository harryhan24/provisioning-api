import NewAllocationJob from "../NewDummyAllocationJob";
import DummyProvider from "../../../StorageProviders/DummyProvider";
import QueueService from "../../../services/QueueService";
import { Allocation } from "../../../database/models";
import logger from "../../../utils/logger";

jest.mock("../../../StorageProviders/DummyProvider");
jest.mock("../../../services/QueueService");

describe("The NewDummyAllocationJob -> constructor", () => {
  test("should set up the right provider", () => {
    const job = new NewAllocationJob();
    expect(job.provider).toBeInstanceOf(DummyProvider);
  });
});

describe("The NewDummyAllocationJob -> process function", () => {
  test("should handle sequelize errors", done => {
    Allocation.findById.mockImplementationOnce(() => {
      throw new Error("error!");
    });

    const job = new NewAllocationJob();
    job.process("a_b_c", { id: 123 }).then(res => {
      expect(res).toBe(false);
      expect(logger.error).toHaveBeenCalledWith(`[NewDummyAllocationJob] Could not process job with ReceiptHandle a_b_c`, {
        allocation: { id: 123 },
        error: "error!",
      });
      done();
    });
  });

  test("should handle an unknown allocation", done => {
    Allocation.findById.mockReturnValueOnce(null);
    const job = new NewAllocationJob();
    job.process("a_b_c", { id: 123 }).then(res => {
      expect(res).toBe(false);
      expect(logger.error).toHaveBeenCalledWith(`[NewDummyAllocationJob] Could not process job with ReceiptHandle a_b_c`, {
        allocation: { id: 123 },
        error: "[NewDummyAllocationJob] Could not find allocation with the specified ID",
      });
      done();
    });
  });

  test("should handle an allocation of the wrong status", done => {
    Allocation.findById.mockReturnValueOnce({ status: 2 });
    const job = new NewAllocationJob();
    job.process("a_b_c", { id: 123 }).then(res => {
      expect(res).toBe(false);
      expect(logger.error).toHaveBeenCalledWith(`[NewDummyAllocationJob] Could not process job with ReceiptHandle a_b_c`, {
        allocation: { id: 123 },
        error: "[NewDummyAllocationJob] Could not request storage for allocation. Allocation does not the right status",
      });
      done();
    });
  });

  test("should not delete the message if requesting storage failed", done => {
    Allocation.findById.mockReturnValueOnce({ status: 1 });
    const receiptHandle = "abc";
    const job = new NewAllocationJob();

    job.provider.requestStorage.mockReturnValueOnce(false);
    job.process(receiptHandle, { id: 123 }).then(res => {
      expect(job.provider.requestStorage).toHaveBeenCalledWith({ status: 1 });
      expect(QueueService.deleteMessage).not.toHaveBeenCalledWith(receiptHandle);
      expect(res).toBe(true);
      done();
    });
  });

  test("should delete the message if storage was requested successfully", done => {
    Allocation.findById.mockReturnValueOnce({ status: 1 });
    const receiptHandle = "abc";
    const job = new NewAllocationJob();

    job.provider.requestStorage.mockReturnValueOnce(true);
    job.process(receiptHandle, { id: 123 }).then(res => {
      expect(job.provider.requestStorage).toHaveBeenCalledWith({ status: 1 });
      expect(QueueService.deleteMessage).toHaveBeenCalledWith(receiptHandle);
      expect(res).toBe(true);
      done();
    });
  });
});
