// Initializes the `poolConfig` service on path `/pool-fee`
const createService = require('feathers-sequelize');
const createModel = require('../../models/pool-fee.model');
const hooks = require('./pool-fee.hooks');

module.exports = function (app) {
  const Model = createModel(app);

  const options = {
    Model
  };

  // Initialize our service with any options it requires
  app.use('/pool-fee', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('pool-fee');

  service.hooks(hooks);
};
