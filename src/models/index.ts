import sequelize from '../config/db';
import User from './User/userModel';

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false }); // change to true to drop tables
    console.log('Database synced');
  } catch (error) {
    console.error('Unable to sync database:', error);
  }
};

export default syncDatabase;
