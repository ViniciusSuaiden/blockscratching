import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
const socket = io('ws://localhost:3000')

socket.on("create wallet", obj => {
  let wallets = JSON.parse(localStorage.getItem('wallets') || "[]")
  wallets.push(obj)
  localStorage.setItem('wallets', JSON.stringify(wallets))
})

socket.on("send money", (amount, payer, payee) => {
  let wallets = JSON.parse(localStorage.getItem('wallets') || "[]")
  wallets = wallets.map(el => {
    switch(el.publicKey){
      case payer:
        el.money -= amount
        break;
      case payee:
        el.money += amount
    }
    return el
  })
  localStorage.setItem('wallets', JSON.stringify(wallets))
})

document.querySelector('#send').onclick = () => {
  const amount = +document.querySelector('#amount').value
  const payer = document.querySelector('#payer').value
  const payee = document.querySelector('#payee').value
  socket.emit('send money', amount, payer, payee)
}

