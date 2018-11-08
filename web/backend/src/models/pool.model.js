const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const pool = sequelizeClient.define('pool', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING
    },
    url: {
      type: DataTypes.STRING
    },
    api: {
      type: DataTypes.STRING
    },
    software: {
      type: DataTypes.STRING
    },
    mining_address: {
      type: DataTypes.STRING
    },
    trusted: {
      type: DataTypes.BOOLEAN
    }

  }, {
    timestamps: false,
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  pool.associate = function (models) {
    pool.hasMany(models.pool_data, {foreignKey: 'pool_id', sourceKey: 'id'})
    pool.hasMany(models.pool_config, {foreignKey: 'pool_id', sourceKey: 'id'})
  };

  return pool;
};
