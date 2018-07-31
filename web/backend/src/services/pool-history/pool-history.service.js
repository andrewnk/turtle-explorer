// Initializes the `miners` service on path `/miners`
const createService = require('feathers-sequelize');
const createModel = require('../../models/pool-data.model');
const hooks = require('./pool-history.hooks');

module.exports = function (app) {
  const Model = createModel(app);

  const options = {
    Model
  };

  // Initialize our service with any options it requires
  app.use('/pool-history', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('pool-history');

  service.hooks(hooks);
};
