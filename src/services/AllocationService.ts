// @flow
import { Allocation, Project } from "../database/models";
import logger from "../utils/logger";

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
    return allocation;
  }
}
