// @flow
import { Project } from "../database/models";
import logger from "../utils/logger";
import AllocationService from "./AllocationService";

export default class ProjectService {
  static async getSingle(uuid: string): Promise<Project | null> {
    return Project.findOne<Project>({ where: { uuid } });
  }

  static async getByApiUser(apiUserId: number): Promise<Project[]> {
    return Project.findAll<Project>({ where: { apiUserId } });
  }

  // TODO: This is a STUB
  static determineAllocation(project: Project): string {
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
      const project = await Project.create<Project>({
        apiUserId,
        shortCode,
        hasHpcRequirement,
        hasHumanData,
        hasHumanIdentifiableData,
      });

      const provider = ProjectService.determineAllocation(project);
      await AllocationService.createAllocation(project, provider);

      await project.reload();

      return project;
    } catch (e) {
      logger.error(`[ProjectService] Failed creating project with error: ${e.message}`, { tags: "ProjectService,createProject" });
      throw new Error("Could not save project. Please try again later.");
    }
  }
}
