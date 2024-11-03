import sequelize from '../config/db';
import User from './DB Models/userModel';
import Transactions from './DB Models/transactionsModel';
import VitarichSales from './DB Models/vitarichSalesModel';
import VitarichSales2024 from './DB Models/vitarichSales2024Model';
import VitarichSummary from './DB Models/vitarichSummaryModel';


const syncDatabase = async () => {
  try {
    await User.sync();
    await Transactions.sync();
    await VitarichSales.sync();
    await VitarichSales2024.sync();
    await VitarichSummary.sync();
    console.log('Database synced');
  } catch (error) {
    console.error('Unable to sync database:', error);
  }
};

export default syncDatabase;
