// @flow
import { Allocation, Project } from "../database/models";
import logger from "../utils/logger";
import QueueService, { TYPE_ALLOCATION_CREATED } from "./QueueService";

export default class AllocationService {
  static async createAllocation(project: Project, provider: string) {
    const allocation = await Allocation.create({
      projectId: project.id,
      status: Allocation.STATUS_INITIAL,
      provider,
      hasHumanData: project.hasHumanData,
      hasHumanIdentifiableData: project.hasHumanIdentifiableData,
      hasHpcRequirement: project.hasHpcRequirement,
    });

    try {
      await QueueService.sendMessage(TYPE_ALLOCATION_CREATED, { id: allocation.id });
    } catch (error) {
      logger.error(
        "[AllocationService] Could not create QUEUE message for new allocation. Allocation will have to be manually picked up.",
        { error },
      );
    }

    return allocation;
  }
}
