const trtl = require('./trtl/trtl.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(trtl);
};
