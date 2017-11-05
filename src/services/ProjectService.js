import { Project } from "../database/models";

export default class ProjectService {
  static async getSingle(uuid) {
    const project = await Project.findOne({ where: { uuid } });
    return project;
  }
}
