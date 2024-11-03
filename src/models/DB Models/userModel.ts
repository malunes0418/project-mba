import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/db';

interface UserAttributes {
  id?: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  resetToken: string | null;
  resetTokenExpires: Date | null;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public resetToken!: string | null;
  public resetTokenExpires!: Date | null;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
    resetToken: {
      type: DataTypes.STRING,
    },
    resetTokenExpires: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: false
  }
);

export default User;
