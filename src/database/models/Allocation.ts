import {
  Table,
  Column,
  AutoIncrement,
  PrimaryKey,
  Model,
  BelongsTo,
  IsUUID,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
} from "sequelize-typescript";

import Project from "./Project";

@Table({
  tableName: "allocations",
})
export default class Allocation extends Model<Allocation> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @IsUUID(4)
  @Column
  uuid: string;

  @ForeignKey(() => Project)
  @Column
  projectId: number;

  @Column status: string;
  @Column provider: string;
  @Column externalId: string;
  @Column groupUuidRo: string;
  @Column groupGidRo: number;
  @Column groupUuidRw: string;
  @Column groupGidRw: number;
  @Column hasHumanData: boolean;
  @Column hasHumanIdentifiableData: boolean;
  @Column hasHpcRequirement: boolean;

  @CreatedAt createdAt: Date;
  @UpdatedAt updatedAt: Date;

  @BelongsTo(() => Project)
  project: Project;
}
