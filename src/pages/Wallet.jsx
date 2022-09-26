import { useEffect, useState } from "react";
import JaraTokenAbi from "./../consts/JaraTokenAbi.json";
import { ethers } from "ethers";
import Interactions from "../components/Interactions";

const Wallet = () => {
  let contractAddress = "0xe1B77C6f6016205fd5346215181D960774f1859E"; // address of the deployed contract

  //Creating states to display the data
  const [connButton, setConnButton] = useState("Connect");
  const [errorMassage, setErrorMassage] = useState("");
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [stakedBalance, setStakedBalance] = useState(null);

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  const [tokenName, setTokenName] = useState("");
  const [balance, setBalance] = useState(null);

  const connectWalletHandler = () => {
    // Connecting to the wallet
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          console.log(accounts[0]);
          accountChangedHandler(accounts[0]);
          setConnButton("Connected");
        })
        .catch((err) => {
          console.log(err);
          setErrorMassage("Failed to connect");
        });
    } else {
      setErrorMassage("Please install MetaMask");
    }
  };

  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount); // setting the default account
    updateEthers(); // updating the ethers
  };

  const updateEthers = async () => {
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum); // creating a provider

    let tempSigner = tempProvider.getSigner(); // creating a signer

    let tempContract = new ethers.Contract( // creating a contract
      contractAddress,
      JaraTokenAbi,
      tempSigner
    );

    setProvider(tempProvider);
    setSigner(tempSigner);
    setContract(tempContract);
  };

  useEffect(() => {
    // if the default account is changed, update the ethers
    if (contract != null) {
      updateBalance();
      updateTokenName();
      updateStakedBalance();
    }
  }, [contract]);

  const updateBalance = async () => {
    // updating the balance
    let balanceBigN = await contract.balanceOf(defaultAccount);
    let balanceNumber = balanceBigN.toString();
    let tokenDecimals = await contract.decimals();

    let tokenBalance = balanceNumber / Math.pow(10, tokenDecimals);

    setBalance(balanceNumber);
  };

  const updateStakedBalance = async () => {
    let balanceBigN = await contract.staked(defaultAccount);
    let balanceNumber = balanceBigN.toString();

    setStakedBalance(balanceNumber);
  };

  const updateTokenName = async () => {
    setTokenName(await contract.name()); // updating the token name
  };

  return (
    <div className="m-auto w-[50%]">
      <h1 className="mt-8 text-3xl font-bold text-[#F64D35] text-center">
        {tokenName + " ERC20"}
      </h1>
      <h2 className="text-xl font-medium">Balance: {balance}</h2>
      <h2 className="text-xl font-medium mb-2 ">Staked: {stakedBalance}</h2>
      <div className="flex justify-center">
        <button
          className={
            defaultAccount
              ? "bg-green-500 p-4 rounded-2xl"
              : "bg-gray-400 p-4 p-4 rounded-2xl"
          }
          onClick={connectWalletHandler}
        >
          {connButton}
        </button>
      </div>
      <p className="mt-4">{errorMassage}</p>
      <hr />

      {defaultAccount && ( // if the default account is not null, display the interactions
        <Interactions
          contract={contract}
          updateBalance={updateBalance}
          defaultAccount={defaultAccount}
        />
      )}
    </div>
  );
};

export default Wallet;
