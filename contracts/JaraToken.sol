// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ZHT is ERC20 {

    mapping(address => uint256) public staked;
    mapping(address => uint256) public stakedFromTS;

    constructor() ERC20("Zht", "ZHT") {
        _mint(msg.sender, 1000000000000000000000000);
    }

    function stake(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        _transfer(msg.sender, address(this), amount);
        if(staked[msg.sender] > 0) {
            makeReward();
        }
        staked[msg.sender] += amount;
        stakedFromTS[msg.sender] = block.timestamp;
    }

    function unstake(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(staked[msg.sender] >= amount, "Insufficient staked balance");
        makeReward();
        _transfer(address(this), msg.sender, amount);
        staked[msg.sender] -= amount;
    }

    function makeReward() public {
        uint256 interval = block.timestamp - stakedFromTS[msg.sender];
        uint256 reward = staked[msg.sender] * interval / 100;
        _mint(msg.sender, reward);
        stakedFromTS[msg.sender] = block.timestamp;
    }

}
