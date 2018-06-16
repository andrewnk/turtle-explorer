
module.exports = {
  before: {
    all: [],
    find: [
      // context => {
      //   const nodeDataModel = context.app.services['node-data'].Model
      //   context.params.sequelize = {
      //      include: [{ model: nodeDataModel }]
      //   }

      //   return Promise.resolve(context);
      // }
    ],
    get: []
  },

  after: {
    all: [],
    find: [],
    get: []
  },

  error: {
    all: [],
    find: [],
    get: []
  }
};
