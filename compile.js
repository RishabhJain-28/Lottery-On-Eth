const solc = require("solc");

const path = require("path");
const fs = require("fs");
const contractPath = path.resolve(__dirname, "contracts", "Lottery.sol");
const contractFile = fs.readFileSync(contractPath, "utf8");
const LotteryContract = solc.compile(contractFile, 1).contracts[":Lottery"];

module.exports = LotteryContract;
