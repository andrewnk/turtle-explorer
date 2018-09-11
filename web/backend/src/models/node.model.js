const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const node = sequelizeClient.define('node', {
    name: {
      type: DataTypes.STRING,
    },
    url: {
      type: DataTypes.STRING,
    },
    port: {
      type: DataTypes.STRING,
    },
    ssl: {
      type: DataTypes.BOOLEAN,
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
  node.associate = function (models) {
    node.hasMany(models.node_data, {foreignKey: 'node_id', sourceKey: 'id'})
  };

  return node;
};
