import StorageProviderInterface from "./StorageProviderInterface";
import { Allocation } from "../database/models";
import QueueService from "../services/QueueService";
import { TYPE_NEW_ALLOCATION_DUMMY } from "../jobs/types";
import logger from "../utils/logger";

export default class DummyProvider implements StorageProviderInterface {
  queueCreationJob(allocation: Allocation): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        await QueueService.sendMessage(TYPE_NEW_ALLOCATION_DUMMY, allocation.get({ plain: true }));
        resolve(true);
      } catch (error) {
        logger.error(`[DummyProvider] Could not queue creation job`, { error, allocation: allocation.get({ plain: true }) });
        resolve(false);
      }
    });
  }

  requestStorage(allocation: Allocation): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        allocation.set("status", Allocation.STATUS_STORAGE_PROVIDED); // Skips PENDING_STORAGE
        await allocation.save();
        resolve(true);
      } catch (error) {
        logger.error(`[DummyProvider] Could not set allocation to STORAGE_PROVIDED`, {
          allocation: allocation.get({ plain: true }),
          error: error.message,
        });
        resolve(false);
      }
    });
  }
}
