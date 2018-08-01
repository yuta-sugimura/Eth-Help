pragma solidity 0.4.23;

import "openzeppelin-solidity/contracts/ownerShip/Ownable.sol";

contract help is Ownable {

  uint256 public totalHelp;

  uint256 public fee;
  uint256 public feeBalance;

  struct Help {
    uint64 id;
    address owner;
    uint64 reward;
    address assistant;
    bool opened;
  }

  mapping(uint256 => Help) public helpList;
  mapping(uint256 => address[]) public contactToId;
  mapping(address => uint256[]) public myHelpId;


  modifier onlyHelpOwner(uint256 _id) {
    require(msg.sender == helpList[_id].owner);
    _;
  }

  modifier checkOpened(uint256 _id) {
    require(helpList[_id].opened != false);
    _;
  }

  modifier checkId(uint256 _id) {
    require( _id < totalHelp);
    _;
  }

  event LogCreateHelp(uint256 _id, address indexed _owner, uint256 _amount);
  event LogContact(uint256 id, address indexed _assistant);
  event LogBeforehand(uint256 _id, address indexed _assistant);
  event LogFinishHelp(uint256 _id);
  event LogChoose(uint256 _id, address indexed _assistant);
  event LogWithdrawRewards(uint256 _id, address indexed _assistant, uint256 _reward, uint256 _fee);
  event LogBurnHelp(uint256 _id);

  function changeFee(uint256 _fee) public onlyOwner {
    fee = _fee;
  }

  function createHelp() public payable {

    uint256 _id = totalHelp;
    totalHelp++;

    helpList[_id].id = uint64(_id);
    helpList[_id].owner = msg.sender;
    helpList[_id].reward = uint64(msg.value);
    helpList[_id].opened = true;

    myHelpId[msg.sender].push(_id);

    emit LogCreateHelp(_id, msg.sender, msg.value);
  }

  function contact(uint256 _id) public checkOpened(_id) checkId(_id) {
    require(msg.sender != helpList[_id].owner);

    contactToId[_id].push(msg.sender);

    emit LogContact(_id, msg.sender);
  }

  function beforehand(uint256 _id, address _assistant)
    public
    onlyHelpOwner(_id) 
    checkOpened(_id) 
    checkId(_id) 
  {
    helpList[_id].assistant = _assistant;

    emit LogBeforehand(_id, _assistant);
  }

  function finishHelp(uint256 _id)
    public 
    onlyHelpOwner(_id) 
    checkOpened(_id) 
    checkId(_id)
  {
    helpList[_id].opened = false;

    emit LogFinishHelp(_id);
  }

  function choose(uint256 _id, address _assistant)
    public
    onlyHelpOwner(_id)
    checkOpened(_id) 
    checkId(_id)
  {
    require(helpList[_id].assistant == address(0));

    helpList[_id].assistant = _assistant;
    helpList[_id].opened = false;

    emit LogChoose(_id, _assistant);
  }

  function withdrawRewards(uint256 _id) public checkId(_id) {
    require(
      helpList[_id].opened != true &&
      helpList[_id].assistant == msg.sender
    );

    msg.sender.transfer(_fee(_id));

    emit LogWithdrawRewards(_id, msg.sender, _fee(_id), fee);
  }

  function _fee(uint256 _id) private returns(uint256) {
    uint256 reward = uint256(helpList[_id].reward);

    uint256 sendAmount = reward - fee;
    feeBalance += fee;

    return(sendAmount);
  }

  function burnHelp(uint256 _id)
    public
    onlyHelpOwner(_id)
    checkOpened(_id) 
    checkId(_id)
  {
    require(helpList[_id].assistant != address(0));

    helpList[_id].opened = false;
    uint256 amount = _fee(_id);
    helpList[_id].reward = 0;

    msg.sender.transfer(amount);

    emit LogBurnHelp(_id);
  }

  function viewHelp(uint256 _id) public view returns(uint256, address, uint256, address, bool) {

    uint256 id_ = helpList[_id].id;
    address owner_ = helpList[_id].owner;
    uint256 reward_ = uint256(helpList[_id].reward);
    address assistant_ = helpList[_id].assistant;
    bool opend_ = helpList[_id].opened;

    return(id_, owner_, reward_, assistant_, opend_);
  }

  function viewLength() public view returns(uint256) {
    return(totalHelp);
  }

  function viewContact(uint256 _id)
    public
    view
    checkId(_id)
    returns(address[])
  {
    return contactToId[_id];
  }

  function viewId()
    public
    view
    returns(uint256[])
  {
    return myHelpId[msg.sender];
  }

  
}
