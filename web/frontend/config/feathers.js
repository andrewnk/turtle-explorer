import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import socket from '~/config/socket'

const feathersClient = feathers().configure(socketio(socket, {
    timeout: 10000
}))

export default feathersClient
