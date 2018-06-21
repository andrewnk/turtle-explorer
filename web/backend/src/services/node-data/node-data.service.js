// Initializes the `nodeData` service on path `/node-data`
const createService = require('feathers-sequelize');
const createModel = require('../../models/node-data.model');
const hooks = require('./node-data.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/node-data', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('node-data');

  service.hooks(hooks);
};
