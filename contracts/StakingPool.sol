pragma solidity 0.5.10;

import "./libs/SafeMath.sol";

contract StakingPool {

    using SafeMath for uint256;

    mapping(address => uint256) public shares;
    uint256 public totalShares;
    
    function () external payable {
    }
    
    function deposit() public payable {
        uint256 amount = msg.value;
        if (totalShares > 0) {
            amount = msg.value
                .mul(totalShares)
                .div(address(this).balance.sub(msg.value));
        }
        
        shares[msg.sender] = shares[msg.sender].add(amount);
        totalShares = totalShares.add(amount);
    }
    
    function withdrawal(uint256 share) public {
        msg.sender.transfer(
            share
                .mul(address(this).balance)
                .div(totalShares)
        );

        totalShares = totalShares.sub(share);
        shares[msg.sender] = shares[msg.sender].sub(share);
    }
}
