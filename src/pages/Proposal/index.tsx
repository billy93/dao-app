import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { GovernorService } from "../../services/GovernorService";
import { supportedChain } from "../../utils";
import Web3 from 'web3';

export const Proposal = () => {
  const { account, library, chainId } = useWeb3React();

  const [proposalThreshold, setProposalThreshold] = useState("0");
  const [proposalQuorumVotes, setProposalQuorumVotes] = useState("0");
  const [proposalVoteDelayed, setProposalVoteDelayed] = useState("0");
  const [proposalVotePeriode, setProposalVotePeriode] = useState("0");
  const [proposal, setProposal] : any[] = useState([]);

  const getProposalThreshold = async() => {
    if(account && supportedChain(chainId)) {
      const governorService = new GovernorService(library, account!, chainId!);

      const threshold = await governorService.getProposalThreshold();
      const resThresold = Web3.utils.fromWei(threshold.toString(), 'ether')
      setProposalThreshold(resThresold);
    }
  }
  const quorumVotes = async() => {
    if(account && supportedChain(chainId)) {
      const governorService = new GovernorService(library, account!, chainId!);

      const quorum = await governorService.getQuorumVotes();
      const res = Web3.utils.fromWei(quorum.toString(), 'ether')
      setProposalQuorumVotes(res);
    }
  }

  const getVoteDelayed = async() => {
    if(account && supportedChain(chainId)) {
      const governorService = new GovernorService(library, account!, chainId!);

      const voteDelay = await governorService.getVotingDelay();
      setProposalVoteDelayed(voteDelay.toString());
    }
  }

  const getVotePeriode = async() => {
    if(account && supportedChain(chainId)) {
      const governorService = new GovernorService(library, account!, chainId!);

      const votePeriode = await governorService.getVotingPeriode();
      setProposalVotePeriode(votePeriode.toString());
    }
  }

  const getProposals = async() => {
    if(account && supportedChain(chainId)) {
      const governorService = new GovernorService(library, account!, chainId!);

      const proposals = await governorService.getProposals();
      setProposal(proposals);
      console.log(proposals);
    }
  }

  const listProposals = proposal.map((p: any) =>
      <tr key={p.id}>
        <th scope="row">1</th>
        <td>{p.title}</td>
        <td>{p.state}</td>
        <td>

        {Web3.utils.fromWei(p.forVotes.toString(), 'ether')}
                                        
        </td>
        <td>
        {Web3.utils.fromWei(p.againstVotes.toString(), 'ether')}
        </td>
        <td>
        {Web3.utils.fromWei(p.abstainVotes.toString(), 'ether')}
        </td>
        <td>
        {Web3.utils.fromWei(p.againstVotes.add(p.forVotes).add(p.abstainVotes).toString(), 'ether')}
        </td>
        <td>
            <div className="btn-group" role="group" aria-label="Basic example">
                <Link to={'/proposal/view/'+p.id.toString()}>                            
                  <button type="button" className="btn btn-primary">View</button>
                </Link>
                <button type="button" className="btn btn-warning">Update</button>
                <button type="button" className="btn btn-success">Vote</button>
                <button type="button" className="btn btn-danger">Cancel</button>
            </div>
        </td>
      </tr>
  );

  useEffect(() => {
    let abortController = new AbortController();  

    if(account && supportedChain(chainId)) {
      getProposalThreshold()
      quorumVotes()
      getVoteDelayed()
      getVotePeriode()
      getProposals()
    }

    return () => {  
      abortController.abort();  
    } 
  },  [library, account, chainId]);
  
    return (
        <div className="container-fluid px-xl-5">
        <section className="py-5">
          
        <div className="row">
            <div className="col-lg-12 mb-4">
                <div className="card">
                  <div className="card-header">
                    <div className="row">
                        <div className="col-auto mr-auto">
                            <h6 className="text-uppercase mb-0">Informations</h6>
                        </div>
                    </div>                  
                  </div>
                  <div className="card-body">

                  <nav>
                        <div className="nav nav-tabs" id="nav-tab" role="tablist">
                            <a className="nav-item nav-link active" id="nav-parameter-tab" data-toggle="tab" href="#nav-parameter" role="tab" aria-controls="nav-parameter" aria-selected="true">Parameter</a>
                            <a className="nav-item nav-link" id="nav-ca-tab" data-toggle="tab" href="#nav-ca" role="tab" aria-controls="nav-ca" aria-selected="false">Contract Address</a>
                        </div>
                    </nav>
                    <div className="tab-content" id="nav-tabContent">
                        <div className="tab-pane fade show active" id="nav-parameter" role="tabpanel" aria-labelledby="nav-parameter-tab">

                          <div className="card-body">
                              <div className="d-flex justify-content-between align-items-start align-items-sm-center mb-4 flex-column flex-sm-row">
                                <div className="left d-flex align-items-center">
                                  <div className="text">
                                    <h6 className="mb-0 d-flex align-items-center"> <span>Proposal threshold</span><span className="dot dot-sm ml-2 bg-violet"></span></h6>
                                  </div>
                                </div>
                                <div className="right ml-5 ml-sm-0 pl-3 pl-sm-0 text-violet">
                                  <h5>{proposalThreshold}</h5>
                                </div>
                              </div>
                              <div className="d-flex justify-content-between align-items-start align-items-sm-center mb-4 flex-column flex-sm-row">
                                <div className="left d-flex align-items-center">
                                  <div className="text">
                                    <h6 className="mb-0 d-flex align-items-center"> <span>Quorum needed</span><span className="dot dot-sm ml-2 bg-green"></span></h6>
                                  </div>
                                </div>
                                <div className="right ml-5 ml-sm-0 pl-3 pl-sm-0 text-green">
                            <h5>{ proposalQuorumVotes}</h5>
                                </div>
                              </div>
                              <div className="d-flex justify-content-between align-items-start align-items-sm-center mb-4 flex-column flex-sm-row">
                                <div className="left d-flex align-items-center">
                                  <div className="text">
                                    <h6 className="mb-0 d-flex align-items-center"> <span>Proposal delay</span><span className="dot dot-sm ml-2 bg-blue"></span></h6>
                                  </div>
                                </div>
                                <div className="right ml-5 ml-sm-0 pl-3 pl-sm-0 text-blue">
                            <h5>{ proposalVoteDelayed}</h5>
                                </div>
                              </div>
                              <div className="d-flex justify-content-between align-items-start align-items-sm-center mb-4 flex-column flex-sm-row">
                                <div className="left d-flex align-items-center">
                                  <div className="text">
                                    <h6 className="mb-0 d-flex align-items-center"> <span>Voting length</span><span className="dot dot-sm ml-2 bg-red"></span></h6>
                                  </div>
                                </div>
                                <div className="right ml-5 ml-sm-0 pl-3 pl-sm-0 text-red">
                            <h5>{ proposalVotePeriode}</h5>
                                </div>
                              </div>
                          </div>
                        </div>
                        
                        <div className="tab-pane fade" id="nav-ca" role="tabpanel" aria-labelledby="nav-ca-tab">
                          <div className="card-body">
                              <div className="d-flex justify-content-between align-items-start align-items-sm-center mb-4 flex-column flex-sm-row">
                                <div className="left d-flex align-items-center">
                                  <div className="text">
                                    <h6 className="mb-0 d-flex align-items-center"> <span>Governor</span><span className="dot dot-sm ml-2 bg-violet"></span></h6>
                                  </div>
                                </div>
                                <div className="right ml-5 ml-sm-0 pl-3 pl-sm-0 text-violet">
                                  <h5>0x1ef0Bf46B37292EF54DfE49689ee0DB3013a6b97</h5>
                                </div>
                              </div>
                              <div className="d-flex justify-content-between align-items-start align-items-sm-center mb-4 flex-column flex-sm-row">
                                <div className="left d-flex align-items-center">
                                  <div className="text">
                                    <h6 className="mb-0 d-flex align-items-center"> <span>Token</span><span className="dot dot-sm ml-2 bg-green"></span></h6>
                                  </div>
                                </div>
                                <div className="right ml-5 ml-sm-0 pl-3 pl-sm-0 text-green">
                                  <h5>0xc18B0B4BC745Eeb8c5D890b705E47E96F38d92F4</h5>
                                </div>
                              </div>
                          </div>
                        </div>
                    </div>                    
                  </div>
                </div>
            </div>            
          </div>
          
          <div className="row">
            <div className="col-lg-12 mb-4">
                <div className="card">
                  <div className="card-header">
                  <div className="row">
                      <div className="col-auto mr-auto">
                          <h6 className="text-uppercase mb-0">Proposals</h6>
                      </div>
                      <div className="col-auto">
                          <Link to='proposal/create'>
                          <button type="button" className="btn btn-primary float-end" >Create Proposal</button>
                          </Link>

                          <Link to='proposal/delegate'>
                          <button type="button" className="btn btn-success float-end" >Delegate Vote</button>
                          </Link>
                      </div>
                  </div>

                    {/* <h6 className="text-uppercase mb-0">Proposals</h6>
                    <p className="text-end"><button type="button" className="btn btn-secondary float-start">Example Button floated left</button></p> */}
                  </div>
                  <div className="card-body">
                    <table className="table card-text">
                      <thead className="thead-dark">
                        <tr>
                          <th>#</th> 
                          <th>Title</th>
                          <th>Status</th>
                          <th>For</th>
                          <th>Against</th>
                          <th>Abstain</th>
                          <th>Total Votes</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {listProposals}
                      </tbody>
                    </table>
                  </div>
                </div>
            </div>            
          </div>
        </section>
      </div>
    )
}