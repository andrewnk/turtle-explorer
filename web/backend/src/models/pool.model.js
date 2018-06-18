// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const pool = sequelizeClient.define('pool', {
    name: {
      type: DataTypes.STRING
    },
    url: {
      type: DataTypes.STRING
    },
    api: {
      type: DataTypes.STRING
    },
    type: {
      type: DataTypes.STRING
    }
  }, {
    timestamps: false,
    hooks: {
      beforeCount(options) {
        options.raw = false;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  pool.associate = function (models) {
    pool.hasMany(models.pool_data, {foreignKey: 'pool_id', sourceKey: 'id'})
  };

  return pool;
};
