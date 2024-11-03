import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/db';

interface VitarichSummaryAttributes {
  SUMMARY_ID?: number;
  MONTH: string;
  LINEQTY: string;
  AT50KG: string;
  EXTENDEDAMOUNT: string;
}

class VitarichSummary extends Model<VitarichSummaryAttributes> implements VitarichSummaryAttributes {
  public SUMMARY_ID!: number;
  public MONTH!: string;
  public LINEQTY!: string;
  public AT50KG!: string;
  public EXTENDEDAMOUNT!: string;
}

VitarichSummary.init(
  {
    SUMMARY_ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    MONTH: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    LINEQTY: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    AT50KG: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    EXTENDEDAMOUNT: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'VITARICH_SUMMARY',
    timestamps: false,
  },
);

export default VitarichSummary;
