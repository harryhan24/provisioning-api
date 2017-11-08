import { Allocation } from "../database/models";

export default interface StorageProviderInterface {
  queueCreationJob(allocation: Allocation): Promise<any>;
  requestStorage(allocation: Allocation): Promise<any>;
};
