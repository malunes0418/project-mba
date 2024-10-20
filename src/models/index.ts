import sequelize from '../config/db';
import User from './User/userModel';

// Sync all models with the database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false }); // Use force: true to drop and recreate tables
    console.log('Database synced');
  } catch (error) {
    console.error('Unable to sync database:', error);
  }
};

export default syncDatabase;
