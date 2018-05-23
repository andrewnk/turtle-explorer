// Initializes the `trtl` service on path `/trtl`
const createService = require('feathers-sequelize');
const createModel = require('../../models/trtl.model');
const hooks = require('./trtl.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/trtl', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('trtl');

  service.hooks(hooks);
};
