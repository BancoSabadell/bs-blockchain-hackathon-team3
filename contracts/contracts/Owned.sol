pragma solidity ^0.4.9;

contract Owned {
    modifier onlyOwner { if (msg.sender != owner) throw; _; }

    address public owner;

    function Owned() { owner = msg.sender;}


    function changeOwner(address _newOwner) onlyOwner {
        owner = _newOwner;
    }
}
