const http = require('http').createServer()
import { Server } from 'socket.io'

export const io = new Server(http, {
    cors: {origin: "*"}
})

import Wallet from './classes/wallet'

io.on('connection', socket => {
    console.log('a user connected')

    const satoshi = new Wallet();
    const bob = new Wallet();
    const alice = new Wallet();

    satoshi.sendMoney(50, bob.publicKey);
    bob.sendMoney(23, alice.publicKey);
    alice.sendMoney(5, bob.publicKey);

    socket.on('send money', (amount, payer, payee) => {
        satoshi.sendMoney(amount, bob.publicKey)
    })
})

http.listen(3000, () => console.log('Server listening on port 3000:3000'))