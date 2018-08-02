import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import getAccounts from './utils/getAccounts'
import getContractInstance from './utils/getContractInstance'
import contractDefinition from '../build/contracts/help.json'

//import './css/oswald.css'
//import './css/open-sans.css'
//import './css/pure-min.css'
//import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null, accounts: null, contract: null,
      createHelp: null, contact: null, beforehand: null,
      finishHelp: null, choose: null, withdraw: null, burnHelp: null,

      //create Help to inputValue
      InputValue: 0,

      //contact to input id
      InputContact: 0,

      //beforehand input
      InputBHId: 0,
      InputBHAddress: '',

      //finishHelp
      InputFHId: 0,

      //choose input
      InputCId: 0,
      InputCAddress: '',

      //withdrawRewards
      InputWRId: 0,

      //burnHelp
      InputBurnHelp: 0,

      //view help
      InputVH: 0,

      viewHelp: {
        id: 0, owner: '', reward: 0, assistant: '', opened: ''
      },

      viewLength: 0,

      viewContact: [], InputViewContact: 0,
      
      viewId: []

    }

    this.InputValue = this.InputValue.bind(this)
    this.InputContact = this.InputContact.bind(this)
    this.InputBHId = this.InputBHId.bind(this)
    this.InputBHAddress = this.InputBHAddress.bind(this)
    this.InputFHId = this.InputFHId.bind(this)
    this.InputCId = this.InputCId.bind(this)
    this.InputCAddress = this.InputCAddress.bind(this)
    this.InputWRId = this.InputWRId.bind(this)
    this.InputBurnHelp = this.InputBurnHelp.bind(this)
    this.InputVH = this.InputVH.bind(this)
    this.InputViewContact = this.InputViewContact.bind(this)


  }

  componentWillMount = async () => {
    // Get network provider and web3 instance.
    try {
      let web3 = await getWeb3()
      let contract = await getContractInstance(web3, contractDefinition)
      let accounts = await getAccounts(web3)

      this.setState({web3, accounts, contract})
      this.createHelp = this.createHelp.bind(this)
      this.contact = this.contact.bind(this)
      this.beforehand = this.beforehand.bind(this)
      this.finishHelp = this.finishHelp.bind(this)
      this.choose = this.choose.bind(this)
      this.withdraw = this.withdraw.bind(this)
      this.burnHelp = this.burnHelp.bind(this)
      this.viewHelp = this.viewHelp.bind(this)

      this.setState(this.viewLength)
      this.setState(this.viewContact)
      this.setState(this.viewId)

    } catch(error) {
      console.log(error)
    }

  }

  createHelp = async() => {
    let {contract, accounts} = this.state

    let value = this.state.InputValue * 1e18
    let createHelp = await contract.createHelp({from: accounts[0], value: value, gasPrice: 1e9})
    this.setState({createHelp})
  }

  contact = async() => {
    let {contract, accounts} = this.state

    let contact = await contract.contact(this.state.InputContact, {from: accounts[0], gasPrice: 1e9})
    this.setState({contact})
  }

  beforehand = async() => {
    let {contract, accounts} = this.state
    let id = this.state.InputBHId
    let address = this.state.InputBHAddress

    let beforehand = await contract.beforehand(
      id, address, {from: accounts[0], gasPrice: 1e9}
    )
    this.setState({beforehand})
  }

  finishHelp = async() => {
    let {contract, accounts} = this.state
    let id = this.state.InputFHId

    let finishHelp = await contract.finishHelp(
      id, {from: accounts[0], gasPrice: 1e9}
    )
    this.setState({finishHelp}) 
  }

  choose = async() => {
    let {contract, accounts} =this.state
    let id = this.state.InputCId
    let address = this.state.InputCAddress

    let choose = await contract.choose(
      id, address, {from: accounts[0], gasPrice: 1e9}
    )

    this.setState({choose})
  }

  withdraw = async() => {
    let {contract, accounts} =this.state
    let id = this.state.InputWRId

    let withdraw = await contract.withdrawRewards(
      id, {from: accounts[0], gasPrice: 1e9}
    )
    this.setState({withdraw})
  }

  burnHelp = async() => {
    let {contract, accounts} = this.state
    let id = this.state.InputBurnHelp

    let burnHelp = await contract.burnHelp(
      id, {from: accounts[0], gasPrice: 1e9}
    )
    this.setState({burnHelp})
  }

  viewHelp = async() => {
    let {contract} = this.state
    let id = this.state.InputVH
    let viewHelp = await contract.viewHelp.call(id)

    let reward = viewHelp[2].toNumber()
    reward /= 1e18

    let assistant
    if(viewHelp[3] === '0x0000000000000000000000000000000000000000' ) {
      assistant = 'IDK'
    } else {
      assistant = viewHelp[3]
    }

    let opened
    if(viewHelp[4] === true) {
      opened = 'open'
    } else {
      opened = 'close'
    }

    this.setState({ viewHelp: {
      id: viewHelp[0].toNumber(),
      owner: viewHelp[1],
      reward: reward,
      assistant: assistant,
      opened: opened}
    })
  }

  viewLength = async() => {
    let {contract} =this.state

    let viewLength = await contract.viewLength.call()
    
    this.setState({viewLength: viewLength.toNumber()})
  }

  viewContact = async() => {
    let {contract} = this.state
    let id = this.state.InputViewContact
    let viewContact = await contract.viewContact.call(id)
    this.setState({viewContact})
  }

  viewId = async() => {
    let {contract, accounts} =this.state
    let viewId = await contract.viewId.call({from: accounts[0]})
    this.setState({viewId: viewId.toString()})
  }
  
  InputValue = (event) => {
    this.setState({InputValue: event.target.value})
  }
  InputContact = (event) => {
    this.setState({InputContact: event.target.value})
  }
  InputBHId = (event) => {
    this.setState({InputBHId: event.target.value})
  }
  InputBHAddress = (event) => {
    this.setState({InputBHAddress: event.target.value})
  }
  InputFHId = (event) => {
    this.setState({InputFHId: event.target.value})
  }
  InputCId = (event) => {
    this.setState({InputCId: event.target.value})
  }
  InputCAddress = (event) => {
    this.setState({InputCAddress: event.target.value})
  }
  InputWRId = (event) => {
    this.setState({InputWRId: event.target.value})
  }
  InputBurnHelp = (event) => {
    this.setState({InputBurnHelp: event.target.value})
  }
  InputVH = (event) => {
    this.setState({InputVH: event.target.value})
  }
  InputViewContact = (event) => {
    this.setState({InputViewContact: event.target.value})
  }


  render() {
    return (
      <div className="App">

        <input type="number" max="20" min="0.001" value={this.state.InputValue} onChange={this.InputValue} />
        <button className="" onClick={this.createHelp} >依頼を作成</button>

        <input type="number" min="0" value={this.state.InputContact} onChange={this.InputContact} />
        <button className="" onClick={this.contact} >コンタクト</button>


        <input type="number" min="0" value={this.state.InputBHId} onChange={this.InputBHId} />
        <input type="text" value={this.state.InputBHAddress} onChange={this.InputBHAddress} />
        <button className="" onClick={this.beforehand}>依頼をお願いする</button>

        <input type="number" min="0" value={this.state.InputFHId} onChange={this.InputFHId} />
        <button className="" onClick={this.finishHelp}>終了する</button>

        <input type="number" min="0" value={this.state.InputCId} onChange={this.InputCId} />
        <input type="text" value={this.state.InputCAddress} onChange={this.InputCAddress} />
        <button className="" onClick={this.choose}>担当を選ぶ</button>

        <input type="number" min="0" value={this.state.InputWRId} onChange={this.InputWRId} />
        <button className="" onClick={this.withdraw}>報酬引き出し</button>

        <input type="number" min="0" value={this.state.InputBurnHelp} onChange={this.InputBurnHelp} />
        <button className="" onClick={this.burnHelp}>依頼を停止する</button>

        <input type="number" min="0" value={this.state.InputVH} onChange={this.InputVH} />
        <button className="" onClick={this.viewHelp}>open</button>

        <p>{this.state.viewHelp.id}</p>
        <p>{this.state.viewHelp.owner}</p>
        <p>{this.state.viewHelp.reward} Ether</p>
        <p>{this.state.viewHelp.assistant}</p>
        <p>{this.state.viewHelp.opened}</p>

        <p>{this.state.viewLength}</p>

        <p>{this.state.viewContact}</p>

        <p>{this.state.viewId}</p>

      </div>
    )
  }

}

export default App
