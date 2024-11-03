import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/db';

interface TransactionsAttributes {
  T_ID?: number;
  T_INVOICENUMBER: string;
  T_ITEMNO: string;
  T_ITEMDESCRIPTION: string;
  T_LINEQTY: string;
}

class Transactions extends Model<TransactionsAttributes> implements TransactionsAttributes {
  public T_ID!: number;
  public T_INVOICENUMBER!: string;
  public T_ITEMNO!: string;
  public T_ITEMDESCRIPTION!: string;
  public T_LINEQTY!: string;
}

Transactions.init(
  {
    T_ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    T_INVOICENUMBER: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    T_ITEMNO: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    T_ITEMDESCRIPTION: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    T_LINEQTY: {
      type: DataTypes.STRING,
      allowNull: true,
  },
},
  {
    sequelize,
    tableName: 'TRANSACTIONS',
    timestamps: false,
  },
);

export default Transactions;
