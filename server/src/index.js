const http = require('http').createServer()
const { Server } = require('socket.io')

const io = new Server(http, {
    cors: {origin: "*"}
})

io.on('connection', socket => {
    console.log('a user connected')

    socket.on('message', message => {
        console.log(message)
        io.emit('message', `${socket.id.substring(0,2)} said ${message}`)
    })
})

http.listen(3000, () => console.log('Server listening on port 3000:3000'))