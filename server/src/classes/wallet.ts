import * as crypto from 'crypto';
import Transaction from './transaction';
import Chain from './chain';
import { io } from '../index' 
import WalletObj from '../interfaces/wallet_obj';

// Wallet gives a user a public/private keypair
export default class Wallet {

  public static socket: any
  public static payerUsername: string
  public static password: string
  public static amount: number
  public static payeeUsername: string

  constructor(username: string, password: string) {
    const salt = crypto.randomBytes(16).toString("hex")
    const hashedPassword = crypto.scryptSync(password, salt, 64)

    io.emit('create wallet', {
      username: username,
      publicKey: `${salt}:${hashedPassword}`,
      money: 0
    })
  }

  static sendMoney(
    payerUsername: string, password: string, 
    amount: number, payeeUsername: string
  ) {
    Wallet.socket.emit("get wallets to send money")
    Wallet.payerUsername = payerUsername
    Wallet.password = password
    Wallet.amount = amount
    Wallet.payeeUsername = payeeUsername
  }
}
