// @flow
import { Project } from "../database/models";

export default class ProjectService {
  static async getSingle(uuid: string) {
    const project = await Project.findOne({ where: { uuid } });
    return project;
  }

  static async getByApiUser(apiUserId: number): Promise<any> {
    return Project.findAll({ where: { apiUserId } });
  }
}
