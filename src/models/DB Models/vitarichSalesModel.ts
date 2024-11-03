import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/db';

interface VitarichSalesAttributes {
  VS_ID?: number;
  VS_REGION: string;
  VS_CUSTOMER: string;
  VS_SALESPERSON: string;
  VS_TERMNAME: string;
  VS_TERMDAYS: string;
  VS_INVOICENUMBER: string;
  VS_ITEMNUMBER: string;
  VS_DESCRIPTION: string;
  VS_LINEQTY: string;
  VS_UOM: string;
  VS_AT50KG: string;
  VS_UNITSELLINGPRICE: string;
  VS_LINEAMOUNT: string;
  VS_DISCOUNT: string;
  VS_TAXAMOUNT: string;
  VS_FREIGHTAMOUNT: string;
  VS_EXTENDEDAMOUNT: string;
  VS_CATEGORYSETDESC: string;
  VS_GROUPING: string;
  VS_ITEMSUBGROUP: string;
  VS_GLMONTH: string;
}

class VitarichSales extends Model<VitarichSalesAttributes> implements VitarichSalesAttributes {
  public VS_ID!: number;
  public VS_REGION!: string;
  public VS_CUSTOMER!: string;
  public VS_SALESPERSON!: string;
  public VS_TERMNAME!: string;
  public VS_TERMDAYS!: string;
  public VS_INVOICENUMBER!: string;
  public VS_ITEMNUMBER!: string;
  public VS_DESCRIPTION!: string;
  public VS_LINEQTY!: string;
  public VS_UOM!: string;
  public VS_AT50KG!: string;
  public VS_UNITSELLINGPRICE!: string;
  public VS_LINEAMOUNT!: string;
  public VS_DISCOUNT!: string;
  public VS_TAXAMOUNT!: string;
  public VS_FREIGHTAMOUNT!: string;
  public VS_EXTENDEDAMOUNT!: string;
  public VS_CATEGORYSETDESC!: string;
  public VS_GROUPING!: string;
  public VS_ITEMSUBGROUP!: string;
  public VS_GLMONTH!: string;
}

VitarichSales.init(
  {
    VS_ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        },
    VS_REGION: {
        type: DataTypes.STRING,
        allowNull: true,
        },
    VS_CUSTOMER: {
        type: DataTypes.STRING,
        allowNull: true,
        },
    VS_SALESPERSON: {
        type: DataTypes.STRING,
        allowNull: true,
        },
    VS_TERMNAME: {
        type: DataTypes.STRING,
        allowNull: true,
        },
    VS_TERMDAYS: {
        type: DataTypes.STRING,
        allowNull: true,
        },
    VS_INVOICENUMBER: {
        type: DataTypes.STRING,
        allowNull: true,
        },
    VS_ITEMNUMBER: {
        type: DataTypes.STRING,
        allowNull: true,
        },
    VS_DESCRIPTION: {
        type: DataTypes.STRING,
        allowNull: true,
        },
    VS_LINEQTY: {
        type: DataTypes.STRING,
        allowNull: true,
        },
    VS_UOM: {
        type: DataTypes.STRING,
        allowNull: true,
        },
    VS_AT50KG: {
        type: DataTypes.STRING,
        allowNull: true,
        },
    VS_UNITSELLINGPRICE: {
        type: DataTypes.STRING,
        allowNull: true,
        },
    VS_LINEAMOUNT: {
        type: DataTypes.STRING,
        allowNull: true,
        },
    VS_DISCOUNT: {
        type: DataTypes.STRING,
        allowNull: true,
        },
    VS_TAXAMOUNT: {
        type: DataTypes.STRING,
        allowNull: true,
        },
    VS_FREIGHTAMOUNT: {
        type: DataTypes.STRING,
        allowNull: true,
        },
    VS_EXTENDEDAMOUNT: {
        type: DataTypes.STRING,
        allowNull: true,
        },
    VS_CATEGORYSETDESC: {
        type: DataTypes.STRING,
        allowNull: true,
        },
    VS_GROUPING: {
        type: DataTypes.STRING,
        allowNull: true,
        },
    VS_ITEMSUBGROUP: {
        type: DataTypes.STRING,
        allowNull: true,
        },
    VS_GLMONTH: {
        type: DataTypes.STRING,
        allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'VITARICH_SALES',
    timestamps: false,
  }
);

export default VitarichSales;
