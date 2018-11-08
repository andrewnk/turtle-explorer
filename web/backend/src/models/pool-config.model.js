const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const poolConfig = sequelizeClient.define('pool_config', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    pool_id: {
      type: DataTypes.INTEGER
    },
    difficulty: {
      type: DataTypes.INTEGER
    },
    port: {
      type: DataTypes.INTEGER
    },
    description: {
      type: DataTypes.STRING
    }
  },
  {
    timestamps: false,
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  poolConfig.associate = function (models) {
    poolConfig.belongsTo(models.pool, {foreignKey: 'pool_id', targetKey: 'id'})
  };

  return poolConfig;
};
