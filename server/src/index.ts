const http = require('http').createServer()
import { Server } from 'socket.io'

export const io = new Server(http, {
    cors: {origin: "*"}
})

import Wallet from './classes/wallet'
import WalletObj from './interfaces/wallet_obj'
import Transaction from './classes/transaction'
import Chain from './classes/chain'

io.on('connection', socket => {
    console.log('a user connected')

    Wallet.socket = socket
    Chain.socket = socket

    new Wallet('satoshi', 'sapass');
    new Wallet('bob', 'bopass');
    new Wallet('alice', 'alpass');

    socket.on("get wallets to send money", (res: any) => {
        let wallets: WalletObj[] = JSON.parse(res)
        let payeePublicKey = wallets.filter(el => el.username == Wallet.payeeUsername)[0].publicKey
        let payerPublicKey = wallets.filter(el => el.username == Wallet.payerUsername)[0].publicKey
        const transaction = new Transaction(Wallet.amount, payerPublicKey, payeePublicKey)
        Chain.instance.addBlock(transaction, payerPublicKey, Wallet.password)
    })

    socket.on('send money', (payer, password, amount, payee) => {
        Wallet.sendMoney(payer, password, amount, payee)
    })
})

http.listen(3000, () => console.log('Server listening on port 3000:3000'))