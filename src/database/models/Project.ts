import {
  Table,
  Column,
  AutoIncrement,
  PrimaryKey,
  Model,
  HasMany,
  BelongsTo,
  IsUUID,
  CreatedAt,
  UpdatedAt,
  DataType,
  ForeignKey,
} from "sequelize-typescript";

import Allocation from "./Allocation";
import ApiUser from "./ApiUser";

@Table({
  tableName: "projects",
})
export default class Project extends Model<Project> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @IsUUID(4)
  @Column({ defaultValue: DataType.UUIDV4 })
  uuid: string;

  @ForeignKey(() => ApiUser)
  @Column
  apiUserId: number;

  @Column shortCode: string;
  @Column hasHumanData: boolean;
  @Column hasHumanIdentifiableData: boolean;
  @Column hasHpcRequirement: boolean;
  @Column notificationUrl: string;

  @CreatedAt createdAt: Date;
  @UpdatedAt updatedAt: Date;

  @BelongsTo(() => ApiUser)
  apiUser: ApiUser;

  @HasMany(() => Allocation)
  allocations: Allocation[];
}
