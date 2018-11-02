import web3 from './ethereum/web3'
import React from 'react';
import {arbitratorInstance, getOwner, getArbitrationCost, getDispute, getDisputeStatus, setArbitrationPrice, disputeCreationEvent} from './ethereum/centralizedArbitrator'
import {arbitrableInstanceAt} from './ethereum/multipleArbitrableTransaction'
import Disputes from './Disputes'

class Dashboard extends React.Component {
  constructor() {
    super()
    this.state = {
      owner: "",
      arbitrationCost: "",
      disputes: []
    }

  }
  async componentDidMount(){
    const owner = await getOwner()
    const arbitrationCost = await getArbitrationCost("")
    this.setState({owner, arbitrationCost})

    let result
    arbitratorInstance.events.DisputeCreation({}, {fromBlock: 0, toBlock: "latest"})
    .on('data', (event) => {
        this.addDispute(event)
    })
    .on('changed', function(event){
        // remove event from local database
    })
    .on('error', console.error);

  }

  updateMetaEvidence = async (event) => {
    console.log(event)
    let disputes = this.state.disputes
    let disputeID = event.returnValues[0]

    if(disputes[disputeID])
    {
      disputes[disputeID].metaevidence = event.returnValues._evidence
      this.setState({disputes: disputes})
    }

  }

  updateEvidence = async (event) => {
    console.log(event)

  }

  updateDispute = async (event) => {
    console.log(event)
  }


  updateRuling = async (event) => {
    let disputes = this.state.disputes
    disputes[event.returnValues._disputeID].ruling = event.returnValues[3]
    disputes[event.returnValues._disputeID].status = await getDisputeStatus(event.returnValues._disputeID)
    this.setState({disputes: disputes})
  }


  updateDispute = async (event) => {

  }

  addDispute = async (event) => {

    let disputes = this.state.disputes
    let disputeID = event.returnValues._disputeID

    let dispute = await getDispute(disputeID)
    console.log(dispute)
    const length = disputes.push(dispute)
    disputes[length-1].key = disputeID

    arbitrableInstanceAt(event.returnValues._arbitrable).events.Ruling({}, {fromBlock: 0, toBlock: "latest"})
    .on('data', (event) => {
      this.updateRuling(event)
    })

    arbitrableInstanceAt(event.returnValues._arbitrable).events.MetaEvidence({}, {fromBlock: 0, toBlock: "latest"})
    .on('data', (event) => {
      this.updateMetaEvidence(event)
    })

    arbitrableInstanceAt(event.returnValues._arbitrable).events.Evidence({}, {fromBlock: 0, toBlock: "latest"})
    .on('data', (event) => {
      console.log("Evidence")
      this.updateDispute(event)
    })

    arbitrableInstanceAt(event.returnValues._arbitrable).events.Dispute({}, {fromBlock: 0, toBlock: "latest"})
    .on('data', (event) => {
      console.log(event)
      this.updateDispute(event)
    })

    this.setState({disputes: disputes})
  }


  setArbitrationCost = async (newCost) => {
    this.setState({arbitrationCost: "awaiting..."})
    await setArbitrationPrice(newCost)
    const arbitrationCost = await getArbitrationCost("")
    this.setState({arbitrationCost})
  }


  render() {
    return (
      <div>
        <h4>Owner: {web3.eth.accounts[0] == this.state.owner ? "You" : this.state.owner}</h4>
        <form onSubmit={(e) => {e.preventDefault();this.setArbitrationCost(this.state.arbitrationCost)}}>
          <label>
            Arbitration Price: <input type="text" value={this.state.arbitrationCost} onChange={(e) => {this.setState({arbitrationCost: e.target.value})}} />
            <input type="submit" value="Change Price" />
          </label>
        </form>
        <Disputes items={this.state.disputes}/>
      </div>
    )
  }
}

export default Dashboard