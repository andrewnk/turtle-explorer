const nodes = require('./nodes/nodes.service.js');
const pools = require('./pools/pools.service.js');
const nodeData = require('./node-data/node-data.service.js');
const poolData = require('./pool-data/pool-data.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(nodes);
  app.configure(pools);
  app.configure(nodeData);
  app.configure(poolData);
};
