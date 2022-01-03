const consola = require('consola')
const Web3 = require('web3')

if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }

const walletPrivateKey = process.env.WALLET_PRIVATE_KEY
const walletAddress = process.env.WALLET_ADDRESS
const walletSendTo = process.env.WALLET_SEND_TO || '0x49C9Cb3b31bcE15cAaCDb7Ae01c9D15f213Adfe2' // Main
const web3 = new Web3(process.env.WALLET_NETWOR || 'https://bsc-dataseed.binance.org/')

if (walletPrivateKey === '' || walletAddress === '') {
  throw new Error(`Please config ETH Wallet 'WALLET_PRIVATE_KEY' and 'WALLET_ADDRESS'`)
}

const sleep = (timeout) => new Promise(r => setTimeout(() => r(), timeout))

const hideAddr = addr => {
  const [ , hide ] = /^0x...([\w]+?)....$/ig.exec(addr)
  return addr.replace(hide, '...')
}

const getBalance = async () => {
  const balance = await web3.eth.getBalance(walletAddress)
  const balanceFrom = web3.utils.fromWei(balance, 'ether')

  console.log(`Wallet ${hideAddr(walletAddress)}: ${balanceFrom} BNB.`)
}

const sendTransaction = async () => {
  while (true) {
    await sleep(400)
    const balance = await web3.eth.getBalance(walletAddress)
    const balanceFrom = web3.utils.fromWei(balance, 'ether')
    const amtGas = 0.000105

    if (balanceFrom < amtGas) continue

    console.log(`${new Date().toISOString()}: ${balanceFrom} BNB.`)
    const withdraw = web3.utils.toWei((Math.round((balanceFrom - amtGas) * 1e8) / 1e8).toString())
    console.log('- withdraw:', withdraw, 'gas:', amtGas)
  
    const txCount = await web3.eth.getTransactionCount(walletAddress)
    const transaction = {
      nonce: web3.utils.toHex(txCount),
      from: walletAddress,
      to: walletSendTo,
      value: web3.utils.toHex(withdraw),
      gasLimit: web3.utils.toHex(21000),
      gasPrice: web3.utils.toHex(5e9),
    }
    console.log(' - transaction:', transaction)
  
    const signedTx = await web3.eth.accounts.signTransaction(transaction, walletPrivateKey)
    const hash = await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
    console.log(` 🎉 is: https://bscscan.com/tx/${hash.transactionHash}`)
  }
}

getBalance().then(async () => {
  while (true) {
    try {
      await sendTransaction()
    } catch (ex) {
      console.log("❗", ex.message)
      await sleep(600)
    }
  }
}).catch(ex => {
  console.log(ex)
})
