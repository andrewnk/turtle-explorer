// Initializes the `pool` service on path `/pool`
const createService = require('feathers-sequelize');
const createModel = require('../../models/pool.model');
const hooks = require('./pool.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/pool', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('pool');

  service.hooks(hooks);
};
