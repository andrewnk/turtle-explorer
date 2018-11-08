const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const helmet = require('helmet');
const logger = require('winston');

const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const routes = require('feathers-hooks-rediscache').cacheRoutes;
const redisClient = require('feathers-hooks-rediscache').redisClient;

const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const channels = require('./channels');

const config = require('./config');
const sequelize = require('./sequelize');
const pgpubsub = require('./pgpubsub');

const app = express(feathers());

// Load app configuration
app.configure(configuration());
app.configure(config);
// Enable security, compression, and body parsing
app.use(helmet());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.errorHandler());

// Set up Plugins and providers
app.configure(socketio(io => {
    const pubsubClient = app.get('pubsubClient');
    io.on('connection', socket => {
        pubsubClient.on('pool', channelPayload => {
            socket.emit('notifyPool', channelPayload)
        });
        pubsubClient.on('poolData', channelPayload => {
            socket.emit('notifyPoolData', channelPayload)
        });
        pubsubClient.on('node', channelPayload => {
            socket.emit('notifyNode', channelPayload)
        });
        pubsubClient.on('nodeData', channelPayload => {
            socket.emit('notifyNodeData', channelPayload)
        });
    });
}));

app.configure(sequelize);
app.configure(pgpubsub);

app.configure(middleware);
app.configure(services);
app.configure(channels);

app.configure(redisClient);

app.use(express.notFound());
app.use(express.errorHandler({ logger }));

app.hooks(appHooks);

module.exports = app;
