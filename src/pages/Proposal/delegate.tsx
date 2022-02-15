import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useState, useRef } from "react"
import { GovernorService } from "../../services/GovernorService";
import { supportedChain } from "../../utils";
import Web3 from "web3"
import styled from 'styled-components';
// import { TOKEN_ADDRESS } from "../../constants"

const usePrevious = (value: any) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
export const DelegateVote = () => {
  const { account, library, chainId } = useWeb3React();
    const [token, setToken] = useState(0);
    const [votingPower, setVotingPower] = useState(0);
    const [currentDelegate, setCurrentDelegate] = useState();
    const [delegateAddress, setDelegateAddress] = useState("");
   const [required, setRequired] = useState(false)
  const [validtyAddress, setValidtyAddress] = useState(false);
   const prevDelegateAddress = usePrevious(delegateAddress)
  
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

        let curDelegate = await governorService.getCurrentDelegate();
        curDelegate = getVotingPower.filter(vot => {
          return vot.delegate.toLowerCase() == curDelegate.toLowerCase();
        });
        setVotingPower(curDelegate[0]?.vote_weight);
      }
    }
   
    const getCurrentDelegate = async() => {
      if(account && supportedChain(chainId)) {
        const governorService = new GovernorService(library, account!, chainId!);
        const curDelegate = await governorService.getCurrentDelegate();
        setCurrentDelegate(curDelegate);
      }
    }
   
    const delegate = async() => {
      const validAddress = Web3.utils.isAddress(delegateAddress)
      if (delegateAddress !== "" && validAddress) {   
        const governorService = new GovernorService(library, account!, chainId!);
        let res = await governorService.delegate(delegateAddress);
        if (res) {
          window.location.reload();
        }
      } else if(delegateAddress !=="" && !validAddress){
          setValidtyAddress(true)
      } else {
       setRequired(true)
      }
    }
    
    const delegateToSelf = async() => {
      const governorService = new GovernorService(library, account!, chainId!);
      if(account != null){
        await governorService.delegate(account);
      }
    }

  useEffect(() => {
    if (delegateAddress !== prevDelegateAddress && delegateAddress !== "" ) {
        setRequired(false)
        setValidtyAddress(false)
      }
   
  }, [delegateAddress, prevDelegateAddress, validtyAddress])
  
    useEffect(() => {
       getToken();
        getVotingPower();
        getCurrentDelegate();
    });
  
  const handleAddressDelegate = (e: any) => {
    let checkValidty = Web3.utils.isAddress(e.target.value);
        if(checkValidty){
          setDelegateAddress(e.target.value)
        } else {
          setValidtyAddress(checkValidty);
        }
  }
  const ValidationInput = styled.div`
        color:red;
        font-size:12px;
        padding:0.4rem;
          `
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
                          <input id="inputHorizontalSuccess" readOnly={true} type="text" placeholder="Your Token" value={token || ""} className="form-control form-control-success"/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-md-3 form-control-label">Voting Weight</label>
                        <div className="col-md-9">
                          <input id="inputVotingWeight"value={votingPower || ""} readOnly={true} type="text" placeholder="Your Voting Weight" className="form-control form-control-success"/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-md-3 form-control-label">Current Delegate</label>
                        <div className="col-md-9">
                          <input id="inputCurrentDelegate"value={currentDelegate || ""} readOnly={true} type="text" placeholder="Current Delegate" className="form-control form-control-success"/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-md-3 form-control-label">Delegate Address</label>
                        <div className="col-md-9">
                          <input id="inputDelegateAddress" type="text" value={delegateAddress || ""} onChange={handleAddressDelegate} placeholder="Enter an ETH Address" className="form-control form-control-success"/>
                            <ValidationInput>
                              { required   && 'Please input  delegate address ' }
                              { validtyAddress && 'Please input valid delegate address ' }
                            </ValidationInput>
                        </div>
                      </div>
                      <div className="form-group row">       
                        <div className="col-md-9 ml-auto">
                          <input type="button" value="Delegate" onClick={e => delegate()} className="btn btn-primary"/>
                          <input type="button" value="Delegate to Self" onClick={e => delegateToSelf()} className="btn btn-primary"/>
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
