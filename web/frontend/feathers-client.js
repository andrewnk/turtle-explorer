import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import socket from './socket'

const feathersClient = feathers().configure(socketio(socket))

export default feathersClient