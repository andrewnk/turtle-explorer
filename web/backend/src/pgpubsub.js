const pgpubsub = require('pg-pubsub');

module.exports = function (app) {
    let pubsubInstance = new pgpubsub(app.get('dbConnStr'));
    pubsubInstance.addChannel('node')
    pubsubInstance.addChannel('poolNetwork');
    pubsubInstance.addChannel('poolConfig');
    pubsubInstance.addChannel('poolPool');
    app.set('pubsubClient', pubsubInstance);
}