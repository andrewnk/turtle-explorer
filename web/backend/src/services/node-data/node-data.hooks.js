
module.exports = {
  before: {
    all: [],
    find: [
      context => {
        const nodeModel = context.app.services.node.Model
        context.params.sequelize = {
           include: [{ model: nodeModel }]
        }

        return Promise.resolve(context);
      }
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
