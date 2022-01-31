require("dotenv").config();

const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");

const { interface, bytecode } = require("./compile");

const provider = new HDWalletProvider(
  process.env.MNEMONIC,
  process.env.RINKBY_ENDPOINT
);

const web3 = new Web3(provider);

const deployLottery = async () => {
  const accounts = await web3.eth.getAccounts();
  const lotteryContratct = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: "1000000" });
  console.log(interface);
  console.log("address of the contract : ", lotteryContratct.options.address);
};

deployLottery();
