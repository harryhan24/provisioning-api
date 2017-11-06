import {
  Table,
  Column,
  AutoIncrement,
  PrimaryKey,
  Model,
  HasMany,
  IsUUID,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

import Project from "./Project";

@Table({
  tableName: "api_users",
})
export default class ApiUser extends Model<ApiUser> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column name: string;

  @IsUUID(4)
  @Column
  uuid: string;

  @Column description: string;

  @Column apiKey: string;

  @Column returnApiKey: string;

  @CreatedAt createdAt: Date;

  @UpdatedAt updatedAt: Date;

  @HasMany(() => Project)
  projects: Project[];
}
