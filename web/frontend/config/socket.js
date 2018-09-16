import io from 'socket.io-client'

const socket = io('http://trtl.rocks:8080', {transports: ['websocket'], forceNew: true})

export default socket
