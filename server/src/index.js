const http = require('http').createServer()

const io = require('socket.io')(http, {
    cors: {origin: "*"}
})

io.on('connection', (socket) => {
    console.log('a user connected')
})

http.listen(3000, () => console.log('Server listening on port 3000'))