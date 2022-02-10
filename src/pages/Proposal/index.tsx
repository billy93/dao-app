import React from "react"
import { Link } from "react-router-dom"

export const Proposal = () => {

    return (
        <div className="container-fluid px-xl-5">
        <section className="py-5">
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
                        <th>Total Votes</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td>Update fee splitter</td>
                        <td>Active</td>
                        <td>
                            <div className="progress">
                            <div className="progress-bar" role="progressbar" style={{"width": "25%"}} >25%</div>
                            </div>                            
                        </td>
                        <td>
                            <div className="progress">
                            <div className="progress-bar bg-danger" role="progressbar" style={{"width": "25%"}} >25%</div>
                            </div>                            
                        </td>
                        <td>100,000</td>
                        <td>
                            <div className="btn-group" role="group" aria-label="Basic example">
                                <Link to='/proposal/view/1'>                            
                                  <button type="button" className="btn btn-primary">View</button>
                                </Link>
                                <button type="button" className="btn btn-warning">Update</button>
                                <button type="button" className="btn btn-success">Vote</button>
                                <button type="button" className="btn btn-danger">Cancel</button>
                            </div>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">2</th>
                        <td>Expand new upToken</td>
                        <td>Queue</td>
                        <td>
                            <div className="progress">
                            <div className="progress-bar" role="progressbar" style={{"width": "25%"}} >25%</div>
                            </div>                            
                        </td>
                        <td>
                            <div className="progress">
                            <div className="progress-bar bg-danger" role="progressbar" style={{"width": "25%"}}>25%</div>
                            </div>                            
                        </td>
                        <td>100,000</td>
                        <td>
                            <div className="btn-group" role="group" aria-label="Basic example">
                                <button type="button" className="btn btn-primary">View</button>
                                <button type="button" className="btn btn-warning">Update</button>
                                <button type="button" className="btn btn-success">Vote</button>
                                <button type="button" className="btn btn-danger">Cancel</button>
                            </div>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">3</th>
                        <td>Update buy/sell slippage</td>
                        <td>Executed</td>
                        <td>
                            <div className="progress">
                            <div className="progress-bar" role="progressbar" style={{"width": "25%"}}>25%</div>
                            </div>                            
                        </td>
                        <td>
                            <div className="progress">
                            <div className="progress-bar bg-danger" role="progressbar" style={{"width": "25%"}}>25%</div>
                            </div>                            
                        </td>
                        <td>100,000</td>
                        <td>
                            <div className="btn-group" role="group" aria-label="Basic example">
                                <button type="button" className="btn btn-primary">View</button>
                                <button type="button" className="btn btn-warning">Update</button>
                                <button type="button" className="btn btn-success">Vote</button>
                                <button type="button" className="btn btn-danger">Cancel</button>
                            </div>
                        </td>
                      </tr>
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