// Initializes the `poolData` service on path `/pool-data`
const createService = require('feathers-sequelize');
const createModel = require('../../models/pool-data.model');
const hooks = require('./pool-data.hooks');

module.exports = function (app) {
  const Model = createModel(app);

  const options = {
    Model
  };

  // Initialize our service with any options it requires
  app.use('/pool-data', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('pool-data');

  service.hooks(hooks);
};
