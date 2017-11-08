// @flow
import { Allocation, Project } from "../database/models";
import logger from "../utils/logger";
import StorageProviderFactory from "../StorageProviders/StorageProviderFactory";

export default class AllocationService {
  static async createAllocation(project: Project, provider: string) {
    const allocation = await Allocation.create<Allocation>({
      projectId: project.id,
      status: Allocation.STATUS_INITIAL,
      provider,
      hasHumanData: project.hasHumanData,
      hasHumanIdentifiableData: project.hasHumanIdentifiableData,
      hasHpcRequirement: project.hasHpcRequirement,
    });

    const storageProvider = StorageProviderFactory.getStorageProviderInstance(provider);
    await storageProvider.queueCreationJob(allocation);

    return allocation;
  }
}
