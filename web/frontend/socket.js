import io from 'socket.io-client'

const socket = io('http://172.19.0.2:3030', {transports: ['websocket'], forceNew: true})

export default socket
