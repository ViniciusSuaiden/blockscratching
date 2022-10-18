import * as crypto from 'crypto';
import Transaction from './transaction'
import Block from './block';

// The blockchain
export default class Chain {
  // Singleton instance
  public static instance = new Chain();
  public static socket: any

  chain: Block[];

  constructor() {
    this.chain = [
      // Genesis block
      new Block('', new Transaction(100, 'genesis', 'satoshi'))
    ];
  }

  // Most recent block
  get lastBlock() {
    return this.chain[this.chain.length - 1];
  }


  // Add a new block to the chain if the password is correct
  addBlock(transaction: Transaction, senderPublicKey: string, password: string) {
    const [salt, key] = senderPublicKey.split(":")
    const hashedBuffer = crypto.scryptSync(password, salt, 64)
    const isValid = hashedBuffer.toString() == key

    if (isValid) {
      const newBlock = new Block(this.lastBlock.hash, transaction);
      this.chain.push(newBlock);
      Chain.socket.emit("send money", transaction.amount, transaction.payer, transaction.payee)
      Chain.socket.emit("set chain", Chain.instance)
    }
  }

}
