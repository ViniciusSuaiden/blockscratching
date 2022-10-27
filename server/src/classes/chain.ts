import * as crypto from 'crypto';
import Transaction from './transaction'
import Block from './block';
import ChainObj from '../interfaces/chain_obj';
import { io } from '../index'

// The blockchain
export default class Chain {
  // Singleton instance
  public static instance = new Chain();
  public static socket: any

  chain: Block[];

  constructor(chain?: Block[]) {
    this.chain = chain?.map(el => new Block(el.prevHash, el.transaction, el.ts)) || [
      // Genesis block
      new Block('', new Transaction(100, 'genesis', 'satoshi'))
    ];
  }

  // Most recent block
  get lastBlock() {
    return this.chain[this.chain.length - 1];
  }

  public static mode(obj: ChainObj) {
    if(Object.keys(obj).length == 0)
        return null;
    var modeMap: { [key: string]: number } = {};
    var maxEl: Chain | null = null;
    var maxCount = 0;
    for(const id in obj)
    {
        var el = obj[id];
        if(modeMap[id] == null)
            modeMap[id] = 1;
        else
            modeMap[id]++;  
        if(modeMap[id] > maxCount)
        {
            maxEl = el;
            maxCount = modeMap[id];
        }
    }
    return maxEl;
}


  // Add a new block to the chain if the password is correct
  addBlock(transaction: Transaction, senderPublicKey: string, password: string) {
    const [salt, key] = senderPublicKey.split(":")
    const hashedBuffer = crypto.scryptSync(password, salt, 64)
    const isValid = hashedBuffer.toString() == key
    console.log(`isValid: ${isValid}`)

    if (isValid) {
      console.log(`this.chain.length: ${this.chain.length - 1}`)
      console.log(`last amount from this.chain: ${this.chain[this.chain.length - 1].transaction.amount}`)
      const newBlock = new Block(this.lastBlock.hash, transaction);
      io.emit("get chains")
      setTimeout(() => {
        Chain.socket.emit("add block", newBlock)
      }, 2000)
    }
  }

}
