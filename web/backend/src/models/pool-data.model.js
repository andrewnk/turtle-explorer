// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const poolData = sequelizeClient.define('pool_data', {
    time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    pool_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: false
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  poolData.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return poolData;
};
