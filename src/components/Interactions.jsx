import { useEffect, useState } from "react";

const Interactions = (props) => {
  const [transferHash, setTransferHash] = useState();

  const transferHandler = async (e) => {
    e.preventDefault();
    let transferAmount = e.target.sendAmount.value;
    let recieverAddress = e.target.recieverAddress.value;

    let txt = await props.contract.transfer(recieverAddress, transferAmount);
    console.log(txt);
    await props.updateBalance();
    setTransferHash("Transfer confirmation hash: " + txt.hash);
  };
  const stakeHandler = async (e) => {
    e.preventDefault();
    let stakeAmount = e.target.stakeAmount.value;
    if (stakeAmount > props.balance) {
      alert("Insufficient balance");
      return;
    }
    let txt = await props.contract.stake(stakeAmount);
    console.log(txt);
    setTransferHash("Stake confirmation hash: " + txt.hash);
  };

  const unstakeHandler = async (e) => {
    e.preventDefault();
    let unstakeAmount = e.target.unstakeAmount.value;
    let txt = await props.contract.unstake(unstakeAmount);
    console.log(txt);
    setTransferHash("Unstake confirmation hash: " + txt.hash);
  };

  const makeRewardHandler = async () => {
    let txt = await props.contract.makeReward();
    console.log(txt);
    setTransferHash("Make reward confirmation hash: " + txt.hash);
  };
  return (
    <>
      <div>
        <h1 className="text-3xl md:text-2xl font-bold mt-10 mb-5 text-center">
          STAKE YOUR MONEY
        </h1>

        <div className="flex justify-between mb-2">
          <div className="w-[48%]">
            <form onSubmit={stakeHandler}>
              <h2>Stake</h2>
              <input
                className="bg-gray-50 border border-gray-300 w-full
             text-gray-900 text-sm rounded-lg focus:ring-blue-500
              focus:border-blue-500 block p-2.5 dark:bg-gray-700
               dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
               dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-4"
                type="text"
                placeholder="AMOUNT"
                id="stakeAmount"
              />
              <button
                type="submit"
                className=" text-white font-bold
            py-2 px-4 rounded-xl bg-transparent text-[#DA4731]
             border-2 border-[#F64D35] font-medium"
              >
                Stake
              </button>
            </form>
          </div>
          <div className="w-[48%]">
            <form onSubmit={unstakeHandler}>
              <h2>Unstake</h2>
              <input
                className="bg-gray-50 border border-gray-300 w-full
             text-gray-900 text-sm rounded-lg focus:ring-blue-500
              focus:border-blue-500 block p-2.5 dark:bg-gray-700
               dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
               dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-4"
                type="text"
                placeholder="AMOUNT"
                id="unstakeAmount"
              />
              <button
                type="submit"
                className=" text-white font-bold
            py-2 px-4 rounded-xl bg-transparent text-[#DA4731]
             border-2 border-[#F64D35] font-medium"
              >
                Unstake
              </button>
            </form>
          </div>
        </div>
        <hr />
      </div>
      <h1 className="text-3xl md:text-2xl font-bold mt-10 mb-5 text-center">
        Reward
      </h1>
      <div className="flex justify-center">
        <button
          type="submit"
          className=" text-white font-bold
            py-2 px-4 rounded-xl bg-[#F64D35] text-white
            text-4xl hover:bg-[#DA4731] m-auto mb-10"
          onClick={makeRewardHandler}
        >
          Harvest
        </button>
      </div>
      <p>{transferHash}</p>
    </>
  );
};

export default Interactions;
