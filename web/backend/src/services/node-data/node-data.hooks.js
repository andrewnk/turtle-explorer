module.exports = {
  before: {
    all: [],
    find: [
      context => {
        const sequelize = context.app.get('sequelizeClient');
        context.params.sequelize = {
            limit: 1,
            order: [
              ['time', 'DESC']
            ]
        }

        return Promise.resolve(context)
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
