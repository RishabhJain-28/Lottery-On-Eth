import Web3 from "web3";

// Modern DApp Browsers
let web3;

if (window.ethereum) {
  console.log("init a new web3 provider ");

  web3 = new Web3(window.ethereum);
  try {
    window.ethereum.enable().then(async function () {
      // User has allowed account access to DApp...
    });
  } catch (err) {
    // User has denied account access to DApp...
    console.log(
      "Error in accessing metamask, User has denied account access",
      err
    );
  }
} else if (window.web3) {
  // Legacy DApp Browsers
  web3 = new Web3(window.web3.currentProvider);
} else {
  // Non-DApp Browsers
  alert("You have to install MetaMask !");
}

export default web3;
