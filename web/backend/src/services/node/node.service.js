// Initializes the `node` service on path `/node`
const createService = require('feathers-sequelize');
const createModel = require('../../models/node.model');
const hooks = require('./node.hooks');

module.exports = function (app) {
  const Model = createModel(app);

  const options = {
    Model
  };

  // Initialize our service with any options it requires
  app.use('/node', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('node');

  service.hooks(hooks);
};
