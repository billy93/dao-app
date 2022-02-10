import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useState } from "react"
// import { TOKEN_ADDRESS } from "../../constants"

export const DelegateVote = () => {
    const { account } = useWeb3React();
    const [token, setToken] = useState(0);
    // const tokenAddress = TOKEN_ADDRESS;

    useEffect(() => {
        setToken(10);
    });

    return (
        <div className="container-fluid px-xl-5">
        <section className="py-5">
          <div className="row">
          
            <div className="col-lg-12 mb-5">
                <div className="card">
                  <div className="card-header">
                    <h3 className="h6 text-uppercase mb-0">Delegate Vote</h3>
                  </div>
                  <div className="card-body">
                    <p>Remember you are delegating all your votes. To get your votes back you have to delegate to yourself again.</p>
                    <form className="form-horizontal">
                      <div className="form-group row">
                        <label className="col-md-3 form-control-label">Your Address</label>
                        <div className="col-md-9">
                          <input id="inputHorizontalSuccess" readOnly={true} type="text" placeholder="Your ETH Address" value={account != null ? account : ""} className="form-control form-control-success"/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-md-3 form-control-label">Token</label>
                        <div className="col-md-9">
                          <input id="inputHorizontalSuccess" readOnly={true} type="text" placeholder="Your Token" value={token} className="form-control form-control-success"/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-md-3 form-control-label">Voting Weight</label>
                        <div className="col-md-9">
                          <input id="inputHorizontalSuccess" readOnly={true} type="text" placeholder="Your Voting Weight" className="form-control form-control-success"/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-md-3 form-control-label">Delegate Address</label>
                        <div className="col-md-9">
                          <input id="inputHorizontalSuccess" type="email" placeholder="Enter an ETH Address" className="form-control form-control-success"/>
                        </div>
                      </div>
                      <div className="form-group row">       
                        <div className="col-md-9 ml-auto">
                          <input type="button" value="Delegate" className="btn btn-primary"/>
                          <input type="button" value="Delegate to Self" className="btn btn-primary"/>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

            
          </div>
        </section>
      </div>
    )
}