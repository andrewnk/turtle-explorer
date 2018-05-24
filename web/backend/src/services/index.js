const node = require('./node/node.service.js');
const pool = require('./pool/pool.service.js');
const nodeData = require('./node-data/node-data.service.js');
const poolData = require('./pool-data/pool-data.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(node);
  app.configure(pool);
  app.configure(nodeData);
  app.configure(poolData);
};
