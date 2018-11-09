const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const poolFee = sequelizeClient.define('pool_fee', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    pool_id: {
      type: DataTypes.INTEGER
    },
    fee_type: {
      type: DataTypes.STRING
    },
    fee: {
      type: DataTypes.FLOAT
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
  poolFee.associate = function (models) {
    poolFee.hasMany(models.pool_config, {foreignKey: 'fee_id', sourceKey: 'id'})
  };

  return poolFee;
};
