const assert = require("assert");
const { describe, it, beforeEach } = require("mocha");
const Web3 = require("web3");
const ganache = require("ganache-cli");

const { interface, bytecode } = require("../compile");

const web3 = new Web3(ganache.provider());

let accounts, lottery;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Lottery Contract", () => {
  it("is deployed", () => {
    assert.ok(lottery.options.address);
  });
  it("has correct manager", async () => {
    const manager = await lottery.methods.manager().call();
    // console.log(lottery);
    assert.strictEqual(manager, accounts[0]);
  });
  it("allows one player to enter the lottery", async () => {
    await lottery.methods
      .enter()
      .send({ from: accounts[0], value: web3.utils.toWei("0.02", "ether") });
    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    });
    assert.strictEqual(accounts[0], players[0]);
    assert(players.length, 1);
  });

  it("allows multiple player to enter the lottery", async () => {
    await lottery.methods
      .enter()
      .send({ from: accounts[0], value: web3.utils.toWei("0.02", "ether") });
    await lottery.methods
      .enter()
      .send({ from: accounts[1], value: web3.utils.toWei("0.02", "ether") });
    await lottery.methods
      .enter()
      .send({ from: accounts[2], value: web3.utils.toWei("0.02", "ether") });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    });

    assert.strictEqual(players.length, 3);
    assert.strictEqual(accounts[0], players[0]);
    assert.strictEqual(accounts[1], players[1]);
    assert.strictEqual(accounts[2], players[2]);
  });

  it("requires minimum amount of ether to enter", async () => {
    try {
      await lottery.methods.enter().send({ from: accounts[0], value: 200 });

      assert(false);
    } catch (err) {
      assert.notStrictEqual(err.code, "ERR_ASSERTION");
      assert(err);
    }
  });

  it("requires manager to call pick winner", async () => {
    try {
      await lottery.methods
        .enter()
        .send({ from: accounts[0], value: web3.utils.toWei("0.02", "ether") });
      await lottery.methods.pickWinner().send({ from: accounts[1] });
      assert(false);
    } catch (err) {
      assert.notStrictEqual(err.code, "ERR_ASSERTION");
      assert(err);
    }
  });

  it("sends money and resets player array ", async () => {
    await lottery.methods
      .enter()
      .send({ from: accounts[1], value: web3.utils.toWei("2", "ether") });

    const prevBalance = await web3.eth.getBalance(accounts[1]);

    await lottery.methods.pickWinner().send({ from: accounts[0] });

    const finalBalance = await web3.eth.getBalance(accounts[1]);
    const difference = finalBalance - prevBalance;

    assert(difference > web3.utils.toWei("1.8", "ether"));

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    });

    assert.strictEqual(players.length, 0);

    const contractBalance = await web3.eth.getBalance(lottery.options.address);
    assert.strictEqual(contractBalance, "0");
  });
});
