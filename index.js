const Web3 = require('web3')

// Variables definition

const web3 = new Web3('https://bsc-dataseed.binance.org/')

const sleep = (timeout) => new Promise(r => setTimeout(() => r(), timeout))

const getBalance = async () => {

  while (true) {
    await sleep(400)
    const balance = await web3.eth.getBalance(addressFrom)
    const balanceFrom = web3.utils.fromWei(balance, 'ether')
    if (balance > 1840000000000) {
      console.log(`The balance of ${addressFrom} is: ${balanceFrom} BNB.`)
    }
  }
  // const ethWeb = await web3.eth.sendTransaction({
  //   from: addressFrom,
  //   to: addressTo,
  //   value: balanceFrom,
  //   gas: 5,
  //   gasPrice: 5,
  // })
  // console.log(ethWeb)
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
  console.log(ex)
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