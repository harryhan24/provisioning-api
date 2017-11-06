import { Table, Column, AutoIncrement, PrimaryKey, Model, HasMany, IsUUID, CreatedAt, UpdatedAt, DataType } from "sequelize-typescript";

@Table({
  tableName: "users",
})
export default class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @IsUUID(4)
  @Column({ defaultValue: DataType.UUIDV4 })
  uuid: string;

  @Column name: string;

  @Column eduPersonPrincipalName: string;

  @Column auEduPersonSharedToken: string;

  @Column mail: string;

  @CreatedAt createdAt: Date;

  @UpdatedAt updatedAt: Date;
}
