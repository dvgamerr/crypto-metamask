const fs = require('fs')
const consola = require('consola')
const chalk = require('chalk')
const Web3 = require('web3')
// const abi = require('erc-20-abi')

const debug = process.env.NODE_ENV !== 'production'
if (debug) { require('dotenv').config() }

const ownerWallet = process.env.WALLET_PRIVATE_KEY
const agentWallet = process.env.AGENT_PRIVATE_KEY
const web3 = new Web3(process.env.WALLET_NETWORK || 'https://bsc-dataseed.binance.org/')

if (agentWallet === '' || ownerWallet === '') {
  throw new Error(`Please config ETH Wallet 'AGENT_PRIVATE_KEY' or 'AGENT_PRIVATE_KEY'`)
}

// eslint-disable-next-line no-unused-vars
const { toHex, fromWei, toWei, BN } = web3.utils

// const tokenAddresses = require('./token-address.json')
// eslint-disable-next-line no-unused-vars
const sleep = (timeout) => new Promise(r => setTimeout(() => r(), timeout))

const hideAddr = addr => {
  let walletName = {}
  if (fs.existsSync('./wallet.json')) {
    walletName = JSON.parse(fs.readFileSync('./wallet.json'))
  }

  if (walletName[addr]) {
    return walletName[addr]
  } else {
    const [ , hide ] = /^0x...([\w]+?)....$/ig.exec(addr)
    return addr.replace(hide, '...')
  }
}

const initWallet = async () => {
  const agent = Object.assign(web3.eth.accounts.privateKeyToAccount(agentWallet), { balance: 0 })
  const owner = Object.assign(web3.eth.accounts.privateKeyToAccount(ownerWallet), { balance: 0 })

  agent.balance = await web3.eth.getBalance(agent.address)
  owner.balance = await web3.eth.getBalance(owner.address)


  const sAddrFrom = chalk.green(hideAddr(agent.address))
  const sAddrTo = chalk.green(hideAddr(owner.address))
  const bWeiFrom = chalk.red(fromWei(agent.balance, 'ether'))
  const bWeiTo = chalk.blue(fromWei(owner.balance, 'ether'))
  consola.info(`Wallet (${sAddrFrom}) : ${bWeiFrom} --> (${sAddrTo}) : ${bWeiTo}`)

  // for (const token of tokenAddresses) {
  //   const contract = new web3.eth.Contract(abi, token.bep20)
  //   const result = await contract.methods.balanceOf(walletAddress).call()

  //   consola.log(`${token.coin} Token:`, fromWei(result))
  // }

  return { owner, agent }
}

const sendTransaction = async (agent, toAddr, gasLimit = 21000, gasPrice = 5, valWei) => {
  const txCount = await web3.eth.getTransactionCount(agent.address)
  // const balance = await web3.eth.getBalance(walletAddress)
  // const balanceFrom = fromWei(balance, 'ether')
  if (valWei instanceof String) valWei = toWei(valWei, 'ether')
  if (valWei === undefined) valWei = await web3.eth.getBalance(agent.address)
  if (valWei <= 0) {
    consola.error('Insufficient money to withdraw.')
    return null
  }

  const calcValue = new BN(valWei)
  const calcGas = toWei(new BN(gasLimit * gasPrice), 'gwei')

  const balance = calcValue.sub(calcGas)
  if (balance <= 0) {
    consola.error('Not enough gas.')
    return null
  }

  consola.info('Estimated')
  console.debug({
    nonce: txCount,
    from: agent.address,
    to: toAddr,
    gas: fromWei(calcGas, 'ether'),
    balance: fromWei(balance, 'ether'),
    withdraw: fromWei(calcValue, 'ether'),
    gasLimit,
    gasPrice
  })


  const signedTx = await web3.eth.accounts.signTransaction({
    nonce: toHex(txCount),
    from: agent.address,
    to: toAddr,
    value: toHex(balance),
    gasLimit: toHex(gasLimit),
    gasPrice: toHex(gasPrice),
  }, agentWallet)

  return await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
}

initWallet().then(async ({ owner, agent }) => {
  try {
    const hash = await sendTransaction(agent, owner.address, 29000, 10)
    if (hash) consola.success(` 🎉 is: https://bscscan.com/tx/${hash.transactionHash}`)
  } catch (ex) {
    consola.error(new Error(`Send Transaction: ${ex.message}`))
    await sleep(600)
  }
}).catch(ex => {
  consola.error(ex)
})
