import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [walletBalance, setWalletBalance] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [ownerError, setOwnerError] = useState(false);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts && accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // once wallet is set, we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      const atmBalance = (await atm.getBalance()).toNumber();
      setBalance(atmBalance);

      if (account) {
        const provider = new ethers.providers.Web3Provider(ethWallet);
        const wallet = provider.getSigner(account);
        const walletBalance = ethers.utils.formatEther(await wallet.getBalance());
        setWalletBalance(walletBalance);
      }
    }
  };

  const deposit = async (amount) => {
    if (atm) {
      let tx = await atm.deposit(amount);
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async (amount) => {
    if (atm) {
      let tx = await atm.withdraw(amount);
      await tx.wait();
      getBalance();
    }
  };

  const transferOwnership = async (newOwner) => {
    if (atm && newOwner) {
      try {
        let tx = await atm.transferOwnership(newOwner);
        await tx.wait();
        alert(`Ownership transferred to ${newOwner}`);
      } catch (error) {
        setOwnerError(true);
        setTimeout(() => {
          setOwnerError(false);
        }, 5000);
      }
    }
  };

  const initUser = () => {
    // Check to see if user has MetaMask
    if (!ethWallet) {
      return (
        <div className="init-message">
          <p>Please install MetaMask in order to use this ATM.</p>
        </div>
      );
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return (
        <div className="init-message">
          <button onClick={connectAccount}>Connect your MetaMask wallet</button>
        </div>
      );
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div className="user-info">
        <p className="account-info">Your Account: {account}</p>
        <p className="balance-info">ATM Balance: {balance} ETH</p>
        <p className="balance-info">MetaMask Balance: {walletBalance} ETH</p>

        <div className="action-buttons">
          <div className="action-group">
            <label>Deposit:</label>
            <button onClick={() => deposit(1)}>1 ETH</button>
            <button onClick={() => deposit(2)}>2 ETH</button>
            <button onClick={() => deposit(5)}>5 ETH</button>
            <button onClick={() => deposit(10)}>10 ETH</button>
          </div>

          <div className="action-group">
            <label>Withdraw:</label>
            <button onClick={() => withdraw(1)}>1 ETH</button>
            <button onClick={() => withdraw(2)}>2 ETH</button>
            <button onClick={() => withdraw(5)}>5 ETH</button>
            <button onClick={() => withdraw(10)}>10 ETH</button>
          </div>
        </div>

        <div className="ownership">
          <button
            onClick={() => {
              const newOwner = prompt("Enter the new owner address:");
              transferOwnership(newOwner);
            }}
          >
            Change Owner
          </button>
          {ownerError && <p className="error-message">Error: Unable to change the Owner</p>}
        </div>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the ATM!</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
          background-color: #f5f5f5;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .init-message {
          margin: 20px;
        }

        .user-info {
          margin-top: 20px;
        }

        .account-info,
        .balance-info {
          font-weight: bold;
        }

        .action-buttons {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }

        .action-group {
          margin-right: 20px;
        }

        button {
          background-color: #00cc99;
          color: #ffffff;
          border: none;
          padding: 8px 16px;
          margin: 4px;
          border-radius: 4px;
          cursor: pointer;
        }

        button:hover {
          background-color: #009966;
        }

        .error-message {
          color: red;
        }
      `}</style>
    </main>
  );
}
