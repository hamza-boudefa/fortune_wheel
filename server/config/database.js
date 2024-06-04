const { Sequelize, DataTypes } = require('sequelize');

const dbConfig = {
  HOST: process.env.MYSQL_ADDON_HOST || "127.0.0.1",
  USER: process.env.MYSQL_ADDON_USER || "root",
  PASSWORD: process.env.MYSQL_ADDON_PASSWORD || null,
  DB: process.env.MYSQL_ADDON_DB || "fortune_wheel",
  dialect: "mysql",
  PORT: process.env.MYSQL_ADDON_PORT || 3306, // Default MySQL port is 3306

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000 // Changed idle time to 10 seconds
  }
};

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    logging: false,
    port: dbConfig.PORT,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    },
    define: {
      timestamps: false // Disabling Sequelize's timestamps by default
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Define the User model
const User = sequelize.define('User', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  activity: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  clientMicrocred: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cin: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true // Assuming 'cin' should be unique
  }
}, {
  tableName: 'users', // Set the table name explicitly
  timestamps: false // Disabling timestamps for this model
});


const Keyword = sequelize.define('Keyword', {
  keywords: {
    type: DataTypes.STRING,
    allowNull: false
  }
});
const pageId = sequelize.define('pageId', {
    pageId: {
    type: DataTypes.STRING,
    allowNull: false
  }
});


db.User = User;
db.Keyword=Keyword
db.pageId=pageId
db.sequelize.sync({ force: false }) // Force synchronization to recreate tables
  .then(() => {
    console.log('Database synchronization complete.');
  })
  .catch(error => {
    console.error('Database synchronization failed:', error);
  });

module.exports = db;
