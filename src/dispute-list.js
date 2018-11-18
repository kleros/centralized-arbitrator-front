import React from 'react'

import Dispute from './dispute'

class DisputeList extends React.Component {
  constructor(props) {
    super(props)
  }

  disputes = () =>
    this.props.items
      .filter(dispute => dispute.status !== '2')
      .sort(function(a, b) {
        return a.id - b.id
      })
      .map(item => {
        console.warn('disputes')
        console.log(item)
        return (
          <Dispute
            key={item.id}
            id={item.id}
            arbitrated={item.arbitrated}
            choices={item.choices}
            fee={item.fee}
            status={item.status || '0'}
            metaevidence={item.metaevidence || 'NO META EVIDENCE'}
            evidences={item.evidences}
          />
        )
      })

  render() {
    return (
      <div>
        <h1>Disputes That Await Your Arbitration</h1>

        <table className="table table-hover" id="disputes">
          <thead>
            <tr>
              <th>ID</th>
              <th>Arbitrable</th>
              <th>Fee (Ether)</th>
              <th>Status</th>
            </tr>
          </thead>

          {this.disputes()}
        </table>
      </div>
    )
  }
}

export default DisputeList