// @flow
import { Project } from "../database/models";
import logger from "../utils/logger";

export default class ProjectService {
  static async getSingle(uuid: string): Promise<Project> {
    const project = await Project.findOne({ where: { uuid } });
    return project;
  }

  static async getByApiUser(apiUserId: number): Promise<Project[]> {
    return Project.findAll({ where: { apiUserId } });
  }

  // TODO: This is a STUB
  static determineAllocation(project): string {
    return "dummy";
  }

  static async createProject(
    apiUserId: number,
    shortCode: string,
    hasHpcRequirement: boolean,
    hasHumanData: boolean,
    hasHumanIdentifiableData: boolean,
  ): Promise<Project> {
    try {
      logger.silly(`[ProjectService] Creating project with shortCode ${shortCode}`);
      const project = await Project.create({
        apiUserId,
        shortCode,
        hasHpcRequirement,
        hasHumanData,
        hasHumanIdentifiableData,
      });

      const allocation = ProjectService.determineAllocation(project);

      return project;
    } catch (e) {
      logger.error(`[ProjectService] Failed creating project with error: ${e.message}`, { tags: "ProjectService,createProject" });
      throw new Error("Could not save project. Please try again later.");
    }
  }
}
