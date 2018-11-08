const pgpubsub = require('pg-pubsub');

module.exports = function (app) {
    let pubsubInstance = new pgpubsub(app.get('dbConnStr'));
    pubsubInstance.addChannel('node')
    pubsubInstance.addChannel('nodeData')
    pubsubInstance.addChannel('pool')
    pubsubInstance.addChannel('poolData');
    app.set('pubsubClient', pubsubInstance);
}