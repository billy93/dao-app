import React, { useEffect, useState } from "react"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
  } from 'chart.js';
import { Line } from 'react-chartjs-2';
import faker from '@faker-js/faker';
import { useWeb3React } from "@web3-react/core";
import { supportedChain } from "../../utils";
import { GovernorService } from "../../services/GovernorService";
import { useParams } from "react-router-dom";
import ReactHtmlParser from 'react-html-parser'; 
import VoteModal from '../../components/VoteModal';
import styled from 'styled-components';

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
  );

  export const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Chart.js Bar Chart',
      },
    },
  };
const Avatar = styled.div`
width:40px;
height:40px;
background:grey;  
border-radius:50%;
`
const verifyColor = {
  color:'green'
}
  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  
  export const data = {
    labels,
    datasets: [
      {
        label: 'For',
        data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Against',
        data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Abstain',
        data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
        backgroundColor: 'rgba(255,255,0, 0.5)',
      },
    ],
  };
  
// import { TOKEN_ADDRESS } from "../../constants"

export interface IProposal {
  title: string;
  description: string;
}

export interface IVote{
  blockNumber: number; 
  address: any; 
  support: string; 
  supportAsText: string; 
  votes: string; 
  reason: any
}

export const ProposalView = () => {
  const { account, library, chainId } = useWeb3React();
  const [proposal, setProposal] = useState<IProposal>();
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [votes, setVotes] = useState<any>([]);
  const [forVotes, setForVotes] = useState<any>([]);
  const [againstVotes, setAgainstVotes] = useState<any>([]);
  const [abstainVotes, setAbstainVotes] = useState<any>([]);
  const toggleVoteModal = () => { setModalOpen(!modalOpen) }
  const [listActions, setListActions] = useState<any>([])
  let { id } = useParams();

  const getProposal = async() => {
    if(account && supportedChain(chainId)) {
      const governorService = new GovernorService(library, account!, chainId!);

      const prop = await governorService.getProposalById(id);
      setProposal(prop);
    }
  }

  const getListActions = async() => {
    if(account && supportedChain(chainId)) {
      const governorService = new GovernorService(library, account!, chainId!);

      const listActions = await governorService.getListActions(id);
      setListActions(listActions);
    }
  }

  const getVotes = async() => {
    if(account && supportedChain(chainId)) {
      const governorService = new GovernorService(library, account!, chainId!);

      const votes = await governorService.getVotes(id);
      setVotes(votes)

      const againstVote = votes.filter(e => {
        return e.support == "0";
      })
      const forVote = votes.filter(e => {
        return e.support == "1";
      })
      const abstainVote = votes.filter(e => {
        return e.support == "2";
      })

      setAgainstVotes(againstVote)
      setForVotes(forVote)
      setAbstainVotes(abstainVote)
    }
  }

  const listForVotes = forVotes.map((p: any, i : any) => 
    <tr>
      <th scope="row">{i+1}</th>
      <td>{p.address}</td>
      <td>{p.votes}</td>
    </tr>
  );

  const listAgainstVotes = againstVotes.map((p: any, i : any) => 
    <tr>
      <th scope="row">{i+1}</th>
      <td>{p.address}</td>
      <td>{p.votes}</td>
    </tr>
  );

  const listAbstainVotes = abstainVotes.map((p: any, i : any) => 
    <tr>
      <th scope="row">{i+1}</th>
      <td>{p.address}</td>
      <td>{p.votes}</td>
    </tr>
  );


  useEffect(() => {
    let abortController = new AbortController();  

    if(account && supportedChain(chainId)) {
      getProposal()
      getVotes()
      getListActions()
    }

    return () => {  
      abortController.abort();  
    } 
  },  [library, account, chainId]);
 
  function truncate(str:string, n:any){
  return (str.length > n) ? str.substr(0, n-1) + '...' : str;
};
  const WrapperAvatar = styled.div`
  width: 50%;
    display: flex;
    justify-content: start;
  `
  const CommentBox = styled.div`
   display: flex;
    flex-wrap: wrap;
    height: auto;
    background: #d3d3d338;
    padding: 0.5rem;
    border-radius: 0px 0px 10px 0px;
    font-size: 12px;
    color: #333333b0;
    min-height: 52px;
    font-family: "Poppins", sans-serif;
  `
  const WrappCommenBox = {
    paddingLeft: '1rem',
    width: '100%'
    
  }
  const WalletStyle = styled.div`
  font-size:13px;
  font-weight:600;
  color:#333;
  font-family: "Poppins", sans-serif;

  `
    return (
        <div className="container-fluid px-xl-5">
        <section className="py-5">
          <div className="row">
            <VoteModal
              modalOpen={modalOpen}
              toggleVoteModal={toggleVoteModal}
            />
            <div className="col-lg-8 mb-5">
                <div className="card">
                  <div className="card-header">
                    <h3 className="h6 text-uppercase mb-0">Proposal - {proposal?.title}</h3>
                  </div>
                  <div className="card-body">
                    <div className="chart-holder">
                      {/* <canvas id="lineChart2" style={{"maxHeight": "14rem !important"}} className="w-100"></canvas> */}
                      <Line options={options} data={data} />
                        </div>
                  </div>
                </div>
            </div>

            <div className="col-lg-4 mb-5">
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                          <h3 className="h6 text-uppercase mb-0">Votes</h3>
                          <button type="submit" className="btn btn-primary" onClick={toggleVoteModal}>vote</button>
                  </div>
                  <div className="card-body">
                    <nav>
                        <div className="nav nav-tabs" id="nav-tab" role="tablist">
                            <a className="nav-item nav-link active" id="nav-for-tab" data-toggle="tab" href="#nav-for" role="tab" aria-controls="nav-for" aria-selected="true">For</a>
                            <a className="nav-item nav-link" id="nav-against-tab" data-toggle="tab" href="#nav-against" role="tab" aria-controls="nav-against" aria-selected="false">Against</a>
                            <a className="nav-item nav-link" id="nav-abstain-tab" data-toggle="tab" href="#nav-abstain" role="tab" aria-controls="nav-abstain" aria-selected="false">Abstain</a>
                        </div>
                    </nav>
                    <div className="tab-content" id="nav-tabContent">
                        <div className="tab-pane fade show active" id="nav-for" role="tabpanel" aria-labelledby="nav-for-tab">
                            <table className="table">
                                <thead>
                                    <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Address</th>
                                    <th scope="col">Votes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listForVotes}
                                </tbody>
                            </table>
                        </div>
                        <div className="tab-pane fade" id="nav-against" role="tabpanel" aria-labelledby="nav-against-tab">
                            <table className="table">
                                <thead>
                                    <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Address</th>
                                    <th scope="col">Votes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listAgainstVotes}
                                </tbody>
                            </table>
                        </div>
                        <div className="tab-pane fade" id="nav-abstain" role="tabpanel" aria-labelledby="nav-abstain-tab">
                          <table className="table">
                                <thead>
                                    <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Address</th>
                                    <th scope="col">Votes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listAbstainVotes}
                                </tbody>
                            </table>
                        </div>
                    </div>
                  </div>
                </div>
            </div>

            
          </div>

          <div className="row">
              <div className="col-lg-12 mb-5">
                <div className="card">
                  <div className="card-header">
                    <h3 className="h6 text-uppercase mb-0">Details</h3>
                  </div>
                  <div className="card-body">
                    <nav>
                        <div className="nav nav-tabs" id="nav-tab" role="tablist">
                            <a className="nav-item nav-link active" id="nav-description-tab" data-toggle="tab" href="#nav-description" role="tab" aria-controls="nav-home" aria-selected="true">Description</a>
                            <a className="nav-item nav-link" id="nav-action-tab" data-toggle="tab" href="#nav-action" role="tab" aria-controls="nav-action" aria-selected="false">Actions</a>
                            <a className="nav-item nav-link" id="nav-comment-tab" data-toggle="tab" href="#nav-comment" role="tab" aria-controls="nav-comment" aria-selected="false">Comments</a>
                            <a className="nav-item nav-link" id="nav-history-tab" data-toggle="tab" href="#nav-history" role="tab" aria-controls="nav-history" aria-selected="false">History</a>
                        </div>
                        </nav>
                        <div className="tab-content" id="nav-tabContent">
                        <div className="tab-pane fade show active" id="nav-description" role="tabpanel" aria-labelledby="nav-description-tab">
                          <div className="card-body">
                            {ReactHtmlParser(proposal?.description)}
                          </div>
                        </div>
                        <div className="tab-pane fade" id="nav-action" role="tabpanel" aria-labelledby="nav-action-tab">
                            <div id="accordion">
                               {
                                  listActions.map((actions:any, i:any) =>(
                                    <div className="card" id={``+i} key={``+i}>
                                      <div className="card-header" id={`heading` + i}>
                                        <div className="row">
                                          <div className="col-auto mr-auto">
                                            <h5 className="mb-0">
                                              <button type="button" className="btn btn-primary" data-toggle="collapse" data-target={`#collapse` + i} aria-expanded="true" aria-controls={`collapse` + i}>
                                                Action #{i + 1}
                                              </button>
                                            </h5>
                                          </div>
                                        </div>
                                      </div>
                                      <div id={`collapse` + i} className="collapse" aria-labelledby={`heading` + i} data-parent="#accordion">
                                          <div className="card-body">
                                          {listActions?.calldatas?.map((item: any, i: any) => {
                                            return (
                                                <div key={i}>
                                                    <h5>Calldatas : </h5>
                                                    <div>{item}</div>
                                                </div>
                                            )
                                          })
                                          }
                                          {listActions?.targets?.map((item: any, i: any) => {
                                            return (
                                                <div key={i}>
                                                    <h5>Target Address : </h5>
                                                    <div>{item}</div>
                                                </div>
                                            )
                                          })
                                          }
                                          {listActions[1]?.map((item: any, i: any) => {
                                            return (
                                                <div key={i}>
                                                    <h5>Value : </h5>
                                                    <div>{item.toString()}</div>
                                                </div>
                                            )
                                          })
                                          }
                                          </div>
                                        </div>
                                    </div>
                                  ))
                               }
                            </div>
                        </div>
                        <div className="tab-pane fade" id="nav-comment" role="tabpanel" aria-labelledby="nav-comment-tab">
                          {
                                                votes && votes.length > 0 && (
                                                votes.map((item:any, i:any) => (
                                                  <div className="card-body">
                                                    <div className="col-lg-12 col-sm-12">
                                                         <div className="card">
                                                        <div className="card-header d-flex justify-content-between align-items-center">                  
                                                              <WrapperAvatar>
                                                                  <Avatar />
                                                                  <div style={WrappCommenBox}>
                                                                    <WalletStyle>
                                                                    {truncate(item.address, 30)}
                                                                    </WalletStyle>
                                                                    <CommentBox> {ReactHtmlParser(item?.reason)}</CommentBox>
                                                                  </div>
                                                              </WrapperAvatar>
                                                             <div key={i}>Vote : {item?.support === "0" ? "For" : item?.support === "1" ? "Against" : "Abstain"}{" "}<i className="fas fa-check-circle" style={verifyColor}></i></div>
                                                           </div>
                                                         </div>
                                                    </div>
                                                 </div>
                                              ))
                                                )
                                              }
                        </div>
                        <div className="tab-pane fade" id="nav-history" role="tabpanel" aria-labelledby="nav-history-tab">

                        </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </section>
      </div>
    )
}
