// Initializes the `nodes` service on path `/nodes`
const createService = require('feathers-sequelize');
const createModel = require('../../models/nodes.model');
const hooks = require('./nodes.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/nodes', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('nodes');

  service.hooks(hooks);
};
