import { useEffect, useState } from "react";
import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";

function App() {
  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");
  const [ether, setEther] = useState("");
  const [message, setMessage] = useState("");
  useEffect(async () => {
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    const manager = await lottery.methods.manager().call();
    setManager(manager);
    const players = await lottery.methods.getPlayers().call();
    setPlayers(players);
    const balance = await web3.eth.getBalance(lottery.options.address);
    setBalance(balance);
  }, []);

  useEffect(() => {
    console.log(manager);
  }, [manager]);
  useEffect(() => {
    console.log(ether);
  }, [ether]);
  const onSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    setMessage("Waiting on transaction succes... ");
    await lottery.methods
      .enter()
      .send({ from: accounts[0], value: web3.utils.toWei(ether, "ether") });
    setMessage("You have benn entered");
  };

  const pickWinner = async () => {
    setMessage("Waiting on transaction succes... ");
    const accounts = await web3.eth.getAccounts();

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    setMessage("winner selected ");
  };

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>
        This is managed by : {manager}. There are corently {players.length}{" "}
        people in this lottery competing to win{" "}
        {web3.utils.fromWei(balance, "ether")} ether!
      </p>
      <hr />
      <form onSubmit={onSubmit}>
        <h4>Want to try your luck? </h4>
        <div>
          <label>Amount of ether to enter </label>
          <input value={ether} onChange={(e) => setEther(e.target.value)} />
          <button>Enter</button>
        </div>
      </form>
      <hr />
      <h4>Ready to pick a winner</h4>
      <button onClick={pickWinner}>Pick a winner</button>
      <hr />
      <h1>{message}</h1>
    </div>
  );
}

export default App;
