const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const poolData = sequelizeClient.define('pool_data', {
    time: {
      type: DataTypes.DATE,
      primaryKey: true
    },
    pool_id: {
      type: DataTypes.INTEGER
    },
    data: {
      type: DataTypes.JSONB
    }
  },
  {
    timestamps: true,
    createdAt: 'time',
    updatedAt: false,
    hooks: {
      beforeCount(options) {
        options.raw = true;
      },
      beforeFind(params) {
        if (params.where.hasOwnProperty('attribute')) {
          delete params.where.attribute
        }
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  poolData.associate = function (models) {
    poolData.belongsTo(models.pool, {foreignKey: 'pool_id', sourceKey: 'id'})
  };

  return poolData;
};
