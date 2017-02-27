pragma solidity ^0.4.9;

import "./Owned.sol";

contract KWC is Owned {

    struct User {
        address addr;
        bytes32 hash;
    }

    User[] public users;

    // Keeps the idx in the array plus one.  (0-> it does not exist)
    mapping(address => uint) addr2idx;
    mapping(bytes32 => uint) hash2idx;

    function authorizeUser(address _addrUser, bytes32 _hashUser) onlyOwner {
        if (addr2idx[_addrUser] > 0) throw;
        if (hash2idx[_hashUser] > 0) throw;

        uint idx = users.length ++;

        users[idx].addr = _addrUser;
        users[idx].hash = _hashUser;

        addr2idx[_addrUser] = idx+1;
        hash2idx[_hashUser] = idx+1;
    }


    function unauthorizeUser(address _addrUser) onlyOwner {
        if (addr2idx[_addrUser] == 0) throw;

        uint idx = addr2idx[_addrUser];

        addr2idx[ users[ users.length -1].addr ] = idx;
        hash2idx[ users[ users.length -1].hash ] = idx;

        idx --;

        addr2idx[ users[ idx ].addr ] = 0;
        hash2idx[ users[ idx ].hash ] = 0;

        users[ idx ].addr = users[ users.length -1 ].addr;
        users[ idx ].hash = users[ users.length -1 ].hash;

        users[ users.length -1 ].addr = 0;
        users[ users.length -1 ].hash = 0;

        users.length --;
    }

    function isAuthorized(address _addrUser) constant returns(bool) {
        return addr2idx[_addrUser]>0;
    }


    function nUsers() constant returns(uint ) {
        return users.length;
    }


    function userFromAddress(address _addr) constant returns (address _addrUser, bytes32 _hashUser) {
        uint idx = addr2idx[_addr];

        if (idx == 0) throw;

        idx--;

        return (users[idx].addr, users[idx].hash );
    }

    function userFromHash(bytes32 _hash) constant returns (address _addrUser, bytes32 _hashUser) {
        uint idx = hash2idx[_hash];

        if (idx == 0) throw;

        idx--;

        return (users[idx].addr, users[idx].hash );
    }

    function userFromIdx(uint idx) constant returns (address _addrUser, bytes32 _hashUser) {
        return (users[idx].addr, users[idx].hash );
    }


}
