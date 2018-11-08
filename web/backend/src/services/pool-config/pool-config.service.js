// Initializes the `poolConfig` service on path `/pool-config`
const createService = require('feathers-sequelize');
const createModel = require('../../models/pool-config.model');
const hooks = require('./pool-config.hooks');

module.exports = function (app) {
  const Model = createModel(app);

  const options = {
    Model
  };

  // Initialize our service with any options it requires
  app.use('/pool-config', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('pool-config');

  service.hooks(hooks);
};
