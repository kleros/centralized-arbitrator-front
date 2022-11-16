import DisputeDetail from "./DisputeDetail"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Archon from "@kleros/archon"
import React, { FC } from "react"
import web3 from "../ethereum/web3"
import { Contract } from "ethers"
import { EvidenceType, MetaevidenceObject } from "../types"

const Dispute: FC<{
  activeWallet: string
  appealPeriodEnd: number
  appealPeriodStart: number
  arbitrated: string
  archon: typeof Archon
  autoAppealableArbitratorInstance: Contract
  evidences: EvidenceType[]
  fee: string
  id: number
  ipfsGateway: string
  metaevidenceObject: MetaevidenceObject
  networkType: string
  ruling: number
  status: string
}> = (p) => {
  const disputeStatusElement = (code: string) => {
    switch (code) {
      case "0":
        return (
          <td className="orange-inverted">
            <b>Vote Pending</b>
          </td>
        )
      case "1":
        return (
          <td className="red-inverted">
            <b>Active</b>
          </td>
        )
      case "2":
        return (
          <td className="primary-inverted">
            <b>Closed</b>
          </td>
        )
      default:
        return (
          <td className="red-inverted">
            <b>Undefined</b>
          </td>
        )
    }
  }

  const apiPrefix = (networkType: string) => {
    switch (networkType) {
      case "mainnet":
        return " "
      case "kovan":
        return "kovan."
      case "ropsten":
        return "ropsten."
      case "goerli":
        return "goerli."
      case "rinkeby":
        return "rinkeby."
      default:
        return " "
    }
  }

  return (
    <React.Fragment>
      <tbody>
        <tr
          aria-controls={`accordion${p.id}`}
          aria-expanded="false"
          className="clickable"
          data-target={`#accordion${p.id}`}
          data-toggle="collapse"
        >
          <td>{p.id}</td>
          <td>
            {p.metaevidenceObject && p.metaevidenceObject.metaEvidenceJSON.title}
          </td>
          <td>
            <a
              href={`https://${apiPrefix(
                p.networkType
              )}etherscan.io/address/${p.arbitrated}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              {`${p.arbitrated.substring(0, 8)}...`}
            </a>
          </td>
          <td>{web3.utils.fromWei(p.fee, "ether")}</td>
          {disputeStatusElement(status)}
          <td>
            <FontAwesomeIcon icon="caret-down" />
          </td>
        </tr>
      </tbody>
      <tbody>
        <tr>
          <td colSpan={Number("6")}>
            <div className="collapse mb-5" id={`accordion${p.id}`}>
              <DisputeDetail
                activeWallet={p.activeWallet}
                aliases={
                  p.metaevidenceObject &&
                  p.metaevidenceObject.metaEvidenceJSON.aliases
                }
                appealPeriodEnd={p.appealPeriodEnd}
                appealPeriodStart={p.appealPeriodStart}
                arbitrableContractAddress={p.arbitrated}
                archon={p.archon}
                category={Number(
                  p.metaevidenceObject &&
                    p.metaevidenceObject.metaEvidenceJSON.category
                )}
                centralizedArbitratorInstance={p.autoAppealableArbitratorInstance}
                description={
                  p.metaevidenceObject &&
                  p.metaevidenceObject.metaEvidenceJSON.description
                }
                evidenceDisplayInterfaceURI={
                  p.metaevidenceObject &&
                  p.metaevidenceObject.metaEvidenceJSON
                    .evidenceDisplayInterfaceURI
                }
                evidences={p.evidences}
                fileURI={
                  p.metaevidenceObject &&
                  p.metaevidenceObject.metaEvidenceJSON.fileURI
                }
                fileValid={p.metaevidenceObject && p.metaevidenceObject.fileValid}
                id={Number(p.id)}
                interfaceValid={
                  p.metaevidenceObject && p.metaevidenceObject.interfaceValid
                }
                ipfsGateway={p.ipfsGateway}
                metaEvidenceJSONValid={
                  p.metaevidenceObject && p.metaevidenceObject.metaEvidenceJSONValid
                }
                question={
                  p.metaevidenceObject &&
                  p.metaevidenceObject.metaEvidenceJSON.question
                }
                ruling={p.ruling}
                rulingOptions={
                  p.metaevidenceObject &&
                  p.metaevidenceObject.metaEvidenceJSON.rulingOptions
                }
                status={status}
                title={
                  p.metaevidenceObject &&
                  p.metaevidenceObject.metaEvidenceJSON.title
                }
                version={
                  (p.metaevidenceObject &&
                    p.metaevidenceObject.metaEvidenceJSON._v) ||
                  "0"
                }
              />
            </div>
          </td>
        </tr>
      </tbody>
    </React.Fragment>
  )
}

/*Dispute.propTypes = {
  activeWallet: PropTypes.string.isRequired,
  appealPeriodEnd: PropTypes.number.isRequired,
  appealPeriodStart: PropTypes.number.isRequired,
  arbitrated: PropTypes.string.isRequired,
  archon: PropTypes.instanceOf(Archon).isRequired,
  autoAppealableArbitratorInstance: PropTypes.instanceOf(web3.eth.Contract)
    .isRequired,
  evidences: PropTypes.arrayOf(PropTypes.object).isRequired,
  fee: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  ipfsGateway: PropTypes.string.isRequired,
  metaevidenceObject: PropTypes.shape({
    aliases: PropTypes.shape({
      [PropTypes.string]: PropTypes.string,
    }),
    category: PropTypes.string,
    description: PropTypes.string,
    fileHash: PropTypes.string,
    fileTypeExtension: PropTypes.string,
    fileURI: PropTypes.string,
    rulingOptions: PropTypes.shape({
      description: PropTypes.arrayOf(PropTypes.string).isRequired,
      titles: PropTypes.arrayOf(PropTypes.string).isRequired,
    }),
    selfHash: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  networkType: PropTypes.string.isRequired,
  ruling: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
}*/

export default Dispute