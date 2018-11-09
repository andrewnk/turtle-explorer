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
    miners: {
      type: DataTypes.INTEGER
    },
    min_payout: {
      type: DataTypes.INTEGER
    },
    hashrate: {
      type: DataTypes.INTEGER
    },
    height: {
      type: DataTypes.INTEGER
    },
    total_payments: {
      type: DataTypes.INTEGER
    },
    miners_paid: {
      type: DataTypes.INTEGER
    },
    total_blocks: {
      type: DataTypes.INTEGER
    },
    last_block_found: {
      type: DataTypes.STRING
    },
    difficulty: {
      type: DataTypes.INTEGER
    },
    status: {
      type: DataTypes.STRING
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
