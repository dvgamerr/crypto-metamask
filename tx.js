const Web3 = require('web3')
// const BN = require('bn.js')


const web3 = new Web3('https://bsc-dataseed1.binance.org:443');
// const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');

const sleep = (timeout) => new Promise(r => setTimeout(() => r(), timeout))

const hideAddr = addr => {
  const [ , hide ] = /^0x..([\w]+?)....$/ig.exec(addr)
  return addr.replace(hide, '..')
}

// const account = web3.eth.accounts.privateKeyToAccount(privKey)
// var account = web3.eth.accounts.create();

const getBalance = async () => {
  const balance = await web3.eth.getBalance(addressFrom)
  const balanceFrom = web3.utils.fromWei(balance, 'ether')

  console.log(`Wallet ${addressFrom}:`, balanceFrom, `BNB.`)

  const amtValue = 0.0002
  // const amtWei =  web3.utils.toWei(amtValue, 'ether')

  console.log('gas fee:', 0.000105)
  const withdraw = web3.utils.toWei((amtValue - 0.000105).toString())
  console.log('Withdraw:', withdraw)


  const txCount = await web3.eth.getTransactionCount(addressFrom)
  const transaction = {
    nonce: web3.utils.toHex(txCount),
    from: addressFrom,
    to: addressTo,
    value: web3.utils.toHex(withdraw),
    gasLimit: web3.utils.toHex(21000),
    gasPrice: web3.utils.toHex(5e9), // 20 Gwei
  }
  console.log('tx:', transaction)

  const signedTx = await web3.eth.accounts.signTransaction(transaction, privKey);
  const hash = await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
  console.log(" 🎉 is:", hash)
}
// const balances = async () => {
//   const balanceFrom = web3.utils.fromWei(
//      await web3.eth.getBalance(addressFrom),
//      'ether'
//   );
//   const balanceTo = await web3.utils.fromWei(
//      await web3.eth.getBalance(addressTo),
//      'ether'
//   );

//   console.log(`The balance of ${addressFrom} is: ${balanceFrom} BNB.`);
//   console.log(`The balance of ${addressTo} is: ${balanceTo} BNB.`);

//   const ethWeb = await web3.eth.sendTransaction({
//     from: addressFrom,
//     to: addressTo,
//     value: balanceFrom,
//     gas: 5,
//     gasPrice: 5,
//   })
//   console.log(ethWeb);
// };


getBalance().catch(ex => {
  console.log(' ❗', ex.message)
});


// const deploy = async () => {
//   console.log(
//     `Attempting to make transaction from ${addressFrom} to ${addressTo}`
//   )

//   const createTransaction = await web3.eth.accounts.signTransaction(
//     {
//       from: addressFrom,
//       to: addressTo,
//       value: web3.utils.toWei('100', 'ether'),
//       gas: '5',
//     },
//     privKey
//   )

//   const createReceipt = await web3.eth.sendSignedTransaction(
//     createTransaction.rawTransaction
//   );
//   console.log(
//     `Transaction successful with hash: ${createReceipt.transactionHash}`
//   );
// }

// deploy();

// var subscription = web3.eth.subscribe('logs', { address: [addressFrom] },function(error, sync){
//   if (!error)
//       console.log(sync);
// })
// .on("data", function(sync){
//   // show some syncing stats
// })
// .on("changed", function(isSyncing){
//   if(isSyncing) {
//       // stop app operation
//   } else {
//       // regain app operation
//   }
// });

// // unsubscribes the subscription
// subscription.unsubscribe(function(error, success){
//   if(success) console.log('Successfully unsubscribed!');
// })