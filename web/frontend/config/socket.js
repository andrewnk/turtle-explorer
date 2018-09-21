import io from 'socket.io-client'

const socket = io(`http://${process.env.WEBSOCKET_HOST}:${process.env.WEBSOCKET_PORT}`, {transports: ['websocket'], forceNew: true})

export default socket
