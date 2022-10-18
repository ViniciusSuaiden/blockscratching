import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
const socket = io('ws://localhost:3000')

socket.on("create wallet", obj => {
  let wallets = JSON.parse(localStorage.getItem('wallets') || "[]")
  wallets = wallets.filter(el => el.username != obj.username)
  wallets.push(obj)
  localStorage.setItem('wallets', JSON.stringify(wallets))
})

socket.on("send money", (amount, payer, payee) => {
  let wallets = JSON.parse(localStorage.getItem('wallets') || "[]")
  wallets = wallets.map(el => {
    switch(el.publicKey){
      case payer: el.money -= amount; break;
      case payee: el.money += amount; break;
    }
    return el
  })
  localStorage.setItem('wallets', JSON.stringify(wallets))
})

socket.on("get wallets to send money", () => {
  socket.emit("get wallets to send money", localStorage.getItem('wallets') || "[]")
})

socket.on("set chain", instance => {
  localStorage.setItem('chain', JSON.stringify(instance))
})

document.querySelector('#send').onclick = () => {
  const payer = document.querySelector('#payer').value
  const password = document.querySelector('#password').value
  const amount = +document.querySelector('#amount').value
  const payee = document.querySelector('#payee').value
  socket.emit('send money', payer, password, amount, payee)
}

