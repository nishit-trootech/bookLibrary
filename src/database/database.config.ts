import { SequelizeOptions } from 'sequelize-typescript';
import * as path from 'path';
import { Sequelize } from 'sequelize';
import dotenv from "dotenv";
import { Book } from 'src/models/book.model';
import { User } from 'src/models/user.model';
dotenv.config();

const sequelizeOptions: SequelizeOptions = {
  dialect: 'postgres',
  host: process.env.DB_TEST_HOST,
  port: 5432,
  username: process.env.DB_TEST_USERNAME,
  password: process.env.DB_TEST_PASSWORD,
  database: process.env.DB_TEST_DATABASE,
  models: [Book, User],
  // models: [],
  // models: [path.join(__dirname, '../**/*.model.ts')],
  define: {
    timestamps: true,
    underscored: true,
  },
  logging:false
};

const sequelize = new Sequelize(sequelizeOptions);

export default sequelize;
export {sequelizeOptions}