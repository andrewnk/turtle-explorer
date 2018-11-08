const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const nodeData = sequelizeClient.define('node_data', {
    time: {
      type: DataTypes.DATE,
      primaryKey: true
    },
    node_id: {
      type: DataTypes.INTEGER
    },
    alt_blocks_count: {
      type: DataTypes.BIGINT
    },
    difficulty: {
      type: DataTypes.BIGINT
    },
    gray_peerlist_size: {
      type: DataTypes.BIGINT
    },
    hashrate: {
      type: DataTypes.BIGINT
    },
    height: {
      type: DataTypes.BIGINT
    },
    incoming_connections_count: {
      type: DataTypes.BIGINT
    },
    last_known_block_index: {
      type: DataTypes.BIGINT
    },
    major_version: {
      type: DataTypes.BIGINT
    },
    minor_version: {
      type: DataTypes.BIGINT
    },
    network_height: {
      type: DataTypes.BIGINT
    },
    outgoing_connections_count: {
      type: DataTypes.BIGINT
    },
    start_time: {
      type: DataTypes.BIGINT
    },
    status: {
      type: DataTypes.STRING
    },
    supported_height: {
      type: DataTypes.BIGINT
    },
    synced: {
      type: DataTypes.BOOLEAN
    },
    testnet: {
      type: DataTypes.BOOLEAN
    },
    tx_count: {
      type: DataTypes.BIGINT
    },
    tx_pool_size: {
      type: DataTypes.BIGINT
    },
    version: {
      type: DataTypes.STRING
    },
    white_peerlist_size: {
      type: DataTypes.BIGINT
    },
    fee: {
      type: DataTypes.FLOAT
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
  nodeData.associate = function (models) {
    nodeData.belongsTo(models.node, {foreignKey: 'node_id', sourceKey: 'id'})
  };

  return nodeData;
};
