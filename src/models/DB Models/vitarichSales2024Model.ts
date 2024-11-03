import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/db';

interface VitarichSales2024Attributes {
  VS_ID?: number;
  GLDATE: Date | null;
  ORDERNUMBER: string;
  DRNUMBER: string;
  ITEMNUMBER: string;
  DESCRIPTION: string;
  LINEQTY: string;
  UNITWEIGHT: string;
  AT50KG: string;
  UOM: string;
  UNITSELLINGPRICE: string;
  DISCOUNT: string;
  LINEAMOUNT: string;
  EXTENDEDAMOUNT: string;
  REVENUEAMOUNT: string;
}

class VitarichSales2024 extends Model<VitarichSales2024Attributes> implements VitarichSales2024Attributes {
  public VS_ID!: number;
  public GLDATE!: Date | null;
  public ORDERNUMBER!: string;
  public DRNUMBER!: string;
  public ITEMNUMBER!: string;
  public DESCRIPTION!: string;
  public LINEQTY!: string;
  public UNITWEIGHT!: string;
  public AT50KG!: string;
  public UOM!: string;
  public UNITSELLINGPRICE!: string;
  public DISCOUNT!: string;
  public LINEAMOUNT!: string;
  public EXTENDEDAMOUNT!: string;
  public REVENUEAMOUNT!: string;
}

VitarichSales2024.init(
  {
    VS_ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        },
    GLDATE: {
        type: DataTypes.DATE,
        allowNull: true,
        },
    ORDERNUMBER: {
        type: DataTypes.STRING,
        allowNull: true,
        },
    DRNUMBER: {
        type: DataTypes.STRING,
        allowNull: true,
        },
    ITEMNUMBER: {
        type: DataTypes.STRING,
        allowNull: true,
        },
    DESCRIPTION: {
        type: DataTypes.STRING,
        allowNull: true,
        },
    LINEQTY: {
        type: DataTypes.STRING,
        allowNull: true,
        },
    UNITWEIGHT: {
        type: DataTypes.STRING,
        allowNull: true,
        },
    AT50KG: {
        type: DataTypes.STRING,
        allowNull: true,
        },
    UOM: {
        type: DataTypes.STRING,
        allowNull: true,
        },
    UNITSELLINGPRICE: {
        type: DataTypes.STRING,
        allowNull: true,
        },
    DISCOUNT: {
        type: DataTypes.STRING,
        allowNull: true,
        },
    LINEAMOUNT: {
        type: DataTypes.STRING,
        allowNull: true,
        },
    EXTENDEDAMOUNT: {
        type: DataTypes.STRING,
        allowNull: true,
        },
    REVENUEAMOUNT: {
        type: DataTypes.STRING,
        allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'VITARICH_SALES_2024',
    timestamps: false,
  }
);

export default VitarichSales2024;
