import io from 'socket.io-client'

const socket = io('http://172.18.0.3:3030', {transports: ['websocket'], forceNew: true})

export default socket
