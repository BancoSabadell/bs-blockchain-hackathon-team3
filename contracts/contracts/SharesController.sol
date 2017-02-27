import "./KWC.sol";
import "./MiniMeToken.sol";
import "./Owned.sol";

contract SharesController is TokenController, Owned {

    struct Transfer {
        address from;
        address to;
        uint amount;
        uint price;
        uint expire;
        bool accepted;
    }

    Transfer[] public transfers;

    MiniMeToken public token;
    KWC public kwc;

    bool enableTransfers;

    function SharesController(address _tokenAddr, address _kwcAddr) {
        token = MiniMeToken(_tokenAddr);
        kwc = KWC(_kwcAddr);
    }
    /// @notice Called when `_owner` sends ether to the MiniMe Token contract
    /// @param _owner The address that sent the ether to create tokens
    /// @return True if the ether is accepted, false if it throws
    function proxyPayment(address _owner) payable returns(bool) {
        throw;
    }

    function onTransfer(address _from, address _to, uint _amount, bytes _ext) returns(bool) {
        return enableTransfers;
    }

    /// @notice Notifies the controller about an approval allowing the
    ///  controller to react if desired
    /// @param _owner The address that calls `approve()`
    /// @param _spender The spender in the `approve()` call
    /// @param _amount The amount in the `approve()` call
    /// @return False if the controller does not authorize the approval
    function onApprove(address _owner, address _spender, uint _amount)
        returns(bool) {
            if (!kwc.isAuthorized(_owner)) return false;
            return true;
        }

    function proposeTransfer(address _to, uint _amount, uint _price, uint _timeout) returns (uint) {
        if (!kwc.isAuthorized(msg.sender)) throw;
        if (!kwc.isAuthorized(_to)) throw;
        uint idx = transfers.length ++;
        transfers[idx].from = msg.sender;
        transfers[idx].to = _to;
        transfers[idx].amount = _amount;
        transfers[idx].price = _price;
        transfers[idx].expire = now + _timeout;
        TransferProposed(
            idx,
            transfers[idx].from,
            transfers[idx].to,
            transfers[idx].amount,
            transfers[idx].price);

    }

    function acceptTransfer(uint _idx) {
        if (_idx >= transfers.length) throw;
        Transfer transfer  = transfers[_idx];
        if (transfers[_idx].to != msg.sender) throw;
        if (!kwc.isAuthorized(msg.sender)) throw;
        if (!kwc.isAuthorized(transfers[_idx].from)) throw;
        if (now > transfers[_idx].expire) throw;
        bytes memory ext = new bytes(1);
        ext[0] = byte(transfers[_idx].price / 0x100 & 0xFF);
        ext[1] = byte(transfers[_idx].price / 0x10000 & 0xFF);
        ext[2] = byte(transfers[_idx].price / 0x1000000 & 0xFF);
        ext[3] = byte(transfers[_idx].price / 0x100000000 & 0xFF);
        enableTransfers = true;
        if (!token.transferFromExt(transfers[_idx].from, transfers[_idx].to, transfers[_idx].amount, ext)) throw;
        enableTransfers = false;
        TransferAccepted(
            _idx,
            transfers[_idx].from,
            transfers[_idx].to,
            transfers[_idx].amount,
            transfers[_idx].price);
    }

    function nTransfers() returns (uint) {
        return transfers.length;
    }

    function createTokens(address _owner, uint _amount) onlyOwner {
        token.generateTokens(_owner, _amount);
    }

    function destroyTokens(address _owner, uint _amount) onlyOwner {
        token.destroyTokens(_owner, _amount);
    }

    event TransferProposed(uint indexed idx, address indexed from, address indexed to, uint amount, uint price);
    event TransferAccepted(uint indexed idx, address indexed from, address indexed to, uint amount, uint price);
}
