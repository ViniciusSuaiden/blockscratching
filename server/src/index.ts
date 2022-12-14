const http = require('http').createServer()
import { Server } from 'socket.io'

export const io = new Server(http, {
    cors: {origin: "*"}
})

// npm i -g ts-node-dev && npm i && ts-node-dev --respawn src/index.ts /// package.json serve

import Wallet from './classes/wallet'
import WalletObj from './interfaces/wallet_obj'
import Transaction from './classes/transaction'
import Chain from './classes/chain'
import ChainObj from './interfaces/chain_obj'
import Block from './classes/block'

let chains: ChainObj = {}

io.on('connection', socket => {
    console.log('a user connected')

    Wallet.socket = socket
    Chain.socket = socket

    new Wallet('satoshi', 'sapass');
    new Wallet('bob', 'bopass');
    new Wallet('alice', 'alpass');

    io.emit("get chains")
    setTimeout(() => {
        Chain.instance = new Chain(Chain.mode(chains)!.chain)
    }, 2000)

    socket.on("add block", newBlock => {
        console.log("// CHAINS //")
        for(let el in chains){
            console.log(`${chains[el].chain.length} ${chains[el].chain[chains[el].chain.length - 1].transaction.amount}`)
        }
        Chain.instance = new Chain(Chain.mode(chains)!.chain)
        console.log(`last amount from Chain.instance.chain: ${Chain.instance.chain[Chain.instance.chain.length - 1].transaction.amount}`)
        console.log(`newBlock amount: ${newBlock.transaction.amount}`)
        Chain.instance.chain.push(new Block(newBlock.prevHash, newBlock.transaction, newBlock.ts));
        Chain.socket.emit("send money", newBlock.transaction.amount, newBlock.transaction.payer, newBlock.transaction.payee)
        io.emit("set chain", Chain.instance)
    })

    socket.on("set chains", instance => {
        chains[socket.id] = instance
    })

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