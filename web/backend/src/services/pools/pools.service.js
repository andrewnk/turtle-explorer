// Initializes the `pools` service on path `/pools`
const createService = require('feathers-sequelize');
const createModel = require('../../models/pools.model');
const hooks = require('./pools.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/pools', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('pools');

  service.hooks(hooks);
};
