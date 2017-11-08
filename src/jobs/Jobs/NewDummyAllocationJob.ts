import JobInterface from "../JobInterface";
import DummyProvider from "../../StorageProviders/DummyProvider";
import QueueService from "../../services/QueueService";
import { Allocation } from "../../database/models";
import logger from "../../utils/logger";

export default class NewDummyAllocationJob implements JobInterface {
  provider: DummyProvider;

  constructor() {
    this.provider = new DummyProvider();
  }

  process(receiptHandle: string, data: any): Promise<boolean> {
    logger.debug(`[NewDummyAllocationJob] Starting to process job with ReceiptHandle ${receiptHandle}`, { allocation: data });
    return new Promise(async (resolve, reject) => {
      try {
        const allocation = await Allocation.findById<Allocation>(data.id);
        if (allocation === null) {
          throw new Error("[NewDummyAllocationJob] Could not find allocation with the specified ID");
        }
        if (allocation.status !== Allocation.STATUS_INITIAL) {
          throw new Error("[NewDummyAllocationJob] Could not request storage for allocation. Allocation does not the right status");
        }

        const response = await this.provider.requestStorage(allocation);
        if (response) {
          await QueueService.deleteMessage(receiptHandle);
        }

        resolve(true);
      } catch (error) {
        logger.error(`[NewDummyAllocationJob] Could not process job with ReceiptHandle ${receiptHandle}`, {
          allocation: data,
          error: error.message,
        });
        resolve(false);
      }
    });
  }
}
