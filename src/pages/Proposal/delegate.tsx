import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useState } from "react"
import { GovernorService } from "../../services/GovernorService";
import { supportedChain } from "../../utils";
import  Web3 from "web3"
// import { TOKEN_ADDRESS } from "../../constants"

export const DelegateVote = () => {
  const { account, library, chainId } = useWeb3React();
    const [token, setToken] = useState(0);
    const [votingPower, setVotingPower] = useState(0);
    
    const getToken = async() => {
      if(account && supportedChain(chainId)) {
        const governorService = new GovernorService(library, account!, chainId!);
        const getToken = await governorService.getToken();

        const res = Web3.utils.fromWei(getToken.toString(), 'ether')
        setToken(parseInt(res));
      }
    }

    const getVotingPower = async() => {
      if(account && supportedChain(chainId)) {
        const governorService = new GovernorService(library, account!, chainId!);
        const getVotingPower = await governorService.getVotingPower();
        setVotingPower(getVotingPower[0].vote_weight);
      }
    }

    useEffect(() => {
        getToken();
        getVotingPower();
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
                          <input id="inputHorizontalSuccess"value={votingPower} readOnly={true} type="text" placeholder="Your Voting Weight" className="form-control form-control-success"/>
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