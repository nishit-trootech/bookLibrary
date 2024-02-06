import { BeforeCreate, BeforeUpdate, Column, DataType, Model, Table } from 'sequelize-typescript';
import bcrypt from 'bcrypt';

@Table({ tableName: 'users', timestamps: true, underscored: false })
export class User extends Model<User> {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: DataType.UUID, // Use UUID type for id column
    defaultValue: DataType.UUIDV4, // Automatically generate UUIDs
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  profileImage: string;

  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(instance: User) {
    if (instance.changed('password')) { // Check if password has been changed
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(instance.password, saltRounds);
      instance.password = hashedPassword;
    }
  }
}
