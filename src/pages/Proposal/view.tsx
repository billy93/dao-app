import React, { useState}from "react"
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
  import VoteModal from '../../components/VoteModal';
//  import SemiTransparentButton from '../../components/SemiTransparentButton';

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

export const ProposalView = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const toggleVoteModal = () => { setModalOpen(!modalOpen) }
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
                    <h3 className="h6 text-uppercase mb-0">Proposal #12313</h3>
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
                                <tr>
                                <th scope="row">1</th>
                                <td>0x00</td>
                                <td>100</td>
                                </tr>
                                <tr>
                                <th scope="row">2</th>
                                <td>0x01</td>
                                <td>20</td>
                                </tr>
                                <tr>
                                <th scope="row">3</th>
                                <td>0x02</td>
                                <td>10</td>
                                </tr>
                            </tbody>
                            </table>
                        </div>
                        <div className="tab-pane fade" id="nav-against" role="tabpanel" aria-labelledby="nav-against-tab">

                        </div>
                        <div className="tab-pane fade" id="nav-abstain" role="tabpanel" aria-labelledby="nav-abstain-tab">

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
                        <table className="table">
                            <thead>
                                <tr>
                                <th scope="col">#</th>
                                <th scope="col">Address</th>
                                <th scope="col">Votes</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <th scope="row">1</th>
                                <td>0x00</td>
                                <td>100</td>
                                </tr>
                                <tr>
                                <th scope="row">2</th>
                                <td>0x01</td>
                                <td>20</td>
                                </tr>
                                <tr>
                                <th scope="row">3</th>
                                <td>0x02</td>
                                <td>10</td>
                                </tr>
                            </tbody>
                            </table>
                        </div>
                        <div className="tab-pane fade" id="nav-action" role="tabpanel" aria-labelledby="nav-action-tab">

                        </div>
                        <div className="tab-pane fade" id="nav-comment" role="tabpanel" aria-labelledby="nav-comment-tab">

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