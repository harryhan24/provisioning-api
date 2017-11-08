import {
  Table,
  Column,
  AutoIncrement,
  PrimaryKey,
  DataType,
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
  static STATUS_INITIAL = 1;
  static STATUS_PENDING_STORAGE = 2;
  static STATUS_STORAGE_PROVIDED = 3;
  static STATUS_PENDING_SHARED = 4;
  static STATUS_ACTIVE = 0;

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @IsUUID(4)
  @Column({ defaultValue: DataType.UUIDV4 })
  uuid: string;

  @ForeignKey(() => Project)
  @Column
  projectId: number;

  @Column status: number;
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
