const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
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
// Enable CORS, security, compression, favicon and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.configure(express.rest());
app.use(express.errorHandler());
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
app.use('/', express.static(app.get('public')));

// Set up Plugins and providers
app.configure(socketio(io => {
    const pubsubClient = app.get('pubsubClient');
    io.on('connection', socket => {
        pubsubClient.on('pool', channelPayload => {
            socket.emit('notifyPool', channelPayload)
        });
        pubsubClient.on('poolNetwork', channelPayload => {
            socket.emit('notifyPoolNetwork', channelPayload)
        });
        pubsubClient.on('poolConfig', channelPayload => {
            socket.emit('notifyPoolConfig', channelPayload)
        });
        pubsubClient.on('poolPool', channelPayload => {
            socket.emit('notifyPoolPool', channelPayload)
        });
        pubsubClient.on('node', channelPayload => {
            socket.emit('notifyNode', channelPayload)
        });
        pubsubClient.on('nodeData', channelPayload => {
            socket.emit('notifyNodeData', channelPayload)
        });
    })
}));

app.configure(sequelize);
app.configure(pgpubsub);

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
// Set up our services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);

app.configure(redisClient)
app.use('/cache', routes(app))

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger }));

app.hooks(appHooks);

module.exports = app;
