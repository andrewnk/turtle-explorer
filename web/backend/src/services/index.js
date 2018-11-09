const node = require('./node/node.service.js');
const pool = require('./pool/pool.service.js');
const nodeData = require('./node-data/node-data.service.js');
const poolData = require('./pool-data/pool-data.service.js');
const poolConfig = require('./pool-config/pool-config.service.js');
const poolFee = require('./pool-fee/pool-fee.service.js');
const nodeHistory = require('./node-history/node-history.service.js');
const poolHistory = require('./pool-history/pool-history.service.js');

// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(node);
  app.configure(pool);
  app.configure(nodeData);
  app.configure(poolData);
  app.configure(poolConfig);
  app.configure(poolFee);
  app.configure(nodeHistory);
  app.configure(poolHistory);
};
