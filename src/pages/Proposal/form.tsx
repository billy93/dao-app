import { useWeb3React } from "@web3-react/core";
import React, { useState, useEffect, useRef } from 'react'
import ReactQuill from 'react-quill'
import { Link } from 'react-router-dom';
import { GovernorService } from "../../services/GovernorService";
import { supportedChain } from "../../utils";
import Web3 from 'web3';

const usePrevious = (value: any) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
export const ProposalForm = () => {
  const { account, library, chainId } = useWeb3React();
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [targets, setTarget] = useState([] as any[]);
  const [values, setValues] = useState([] as any[]);
  const [callData, setCalldata] = useState([] as any[]);
  const [actions, setActions] = useState([] as any[]);
  const prevAction = usePrevious(actions)

  const postProposal = async (params: any) => {
    if (account && supportedChain(chainId)) {
      const governorService = new GovernorService(library, account!, chainId!);
      await governorService.postPropose(params);
    }
  }

  useEffect(() => {
    let i = 0;
    var calldata = [] as any[];
    if (actions !== prevAction) {
      for (i = 0; i < actions.length; i++) {
        calldata.push("0x")
      }
      setCalldata(calldata);
    }

  }, [actions, prevAction])

  function addAction() {
    var data = actions.filter((item, idx) => { return true });
    data.push([1]);
    setActions(data);
  }

  function removeAction(index: any) {
    const data = actions.filter((item, idx) => idx !== index);
    setActions(data);
  }

  const handleText = (e: any) => {
    setTitle(e.target.value)
  }

  const handleTarget = (e: any) => {
    setTarget([...targets, e.target.value])
  }

  const handleValues = (e: any) => {
    let valueEth = Web3.utils.toWei(e.target.value, 'ether')
    setValues([...values, valueEth])
  }

  const handleSubmit = (e: any) => {
    // let token = Web3.utils.toWei("1", 'ether')
    let params = {
      targets,
      values,
      calldata: callData,
      description: title + ' | '+value
    }
    e.preventDefault()
    try {
      postProposal(params);
    } catch (e) {
      console.log(e)
    }
  };

  return (
    <form className="form-horizontal">
      <div className="form-group row">
        <label className="col-md-3 form-control-label">Title</label>
        <div className="col-md-9">
          <input type="text" className="form-control" value={title} onChange={handleText} name="title" />
        </div>
      </div>

      <div className="line"></div>

      <div className="form-group row">
        <label className="col-md-3 form-control-label">Description</label>
        <div className="col-md-9">
          <ReactQuill theme="snow" value={value} onChange={setValue} style={{ "height": "200px" }} />
        </div>
      </div>

      <div className="line"></div>

      <div className="form-group row">
        <label className="col-md-3 form-control-label">Actions</label>
        <div className="col-md-9">

          <div className="form-group row">
            <button type="button" className="btn btn-primary" onClick={(e) => addAction()}>
              Add Action
            </button>
          </div>

          <div id="accordion">
            {
              actions.map((act, i) =>
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
                      <div className="col-auto">
                        <button type="button" className="btn btn-danger float-end" onClick={(e) => { removeAction(i) }}>Remove Action</button>
                      </div>
                    </div>
                  </div>

                  <div id={`collapse` + i} className="collapse" aria-labelledby={`heading` + i} data-parent="#accordion">
                    <div className="card-body">
                      <nav>
                        <div className="nav nav-tabs" id="nav-tab" role="tablist">
                          <a className="nav-item nav-link active" id="nav-parameter-tab" data-toggle="tab" href="#nav-parameter" role="tab" aria-controls="nav-parameter" aria-selected="true">Transfer Token</a>
                          <a className="nav-item nav-link" id="nav-ca-tab" data-toggle="tab" href="#nav-ca" role="tab" aria-controls="nav-ca" aria-selected="false">Add Custom Token</a>
                        </div>
                      </nav>
                      <div className="tab-content" id="nav-tabContent">
                        <div className="tab-pane fade show active" id="nav-parameter" role="tabpanel" aria-labelledby="nav-parameter-tab">
                          <div className="card-body">
                            <div className="col-lg-12 mb-5">
                              {/* <p>Remember you are delegating all your votes. To get your votes back you have to delegate to yourself again.</p> */}
                              <div className="form-horizontal">
                                <div className="form-group row">
                                  <label className="col-md-3 form-control-label bold">Target Wallet Address</label>
                                  <div className="col-md-9">
                                    <input id="inputHorizontalSuccess" type="text" placeholder="Enter the  target Address..." className="form-control form-control-success" name="target" onChange={handleTarget} />
                                  </div>
                                </div>
                                <div className="form-group row">
                                  <label className="col-md-3 form-control-label">Value on<span style={{ fontWeight: 'bold' }}>$ETH</span></label>
                                  <div className="col-md-9">
                                    <input id="inputHorizontalSuccess" type="text" placeholder="0" className="form-control form-control-success" name="value" onChange={handleValues} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="tab-pane fade show " id="nav-ca" role="tabpanel" aria-labelledby="nav-ca-tab">
                          <div className="card-body">
                            <div className="col-lg-12 mb-5">
                              {/* <p>Remember you are delegating all your votes. To get your votes back you have to delegate to yourself again.</p> */}
                              <div className="form-horizontal">
                                <div className="form-group row">
                                  <label className="col-md-3 form-control-label bold">Target Contract Address</label>
                                  <div className="col-md-9">
                                    <input id="inputHorizontalSuccess" type="text" placeholder="Enter the  target Address..." className="form-control form-control-success" />
                                  </div>
                                </div>
                                <div className="form-group row">
                                  <label className="col-md-3 form-control-label bold">Contract Method</label>
                                  <div className="col-md-9">
                                    <select className="form-control" id="exampleFormControlSelect1">
                                      <option>method 1</option>
                                      <option>method 2</option>
                                      <option>method 3</option>
                                    </select>
                                  </div>
                                </div>
                                <div className="form-group row">
                                  <label className="col-md-3 form-control-label">Value on<span style={{ fontWeight: 'bold' }}>$ETH</span></label>
                                  <div className="col-md-9">
                                    <input id="inputHorizontalSuccess" type="text" placeholder="0" className="form-control form-control-success" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* <div style={{display:'flex', flexDirection:'column'}}>
                              {
                                !isSendToken && <>
                                 <button onClick={() =>handleSubAction('send token')(i)}>send token</button>
                                <button>custom coin</button>
                                </>
                              }
                              {
                                isSendToken &&  
                                <>
                                 <label className="col-md-3 form-control-label">Target wallet address</label>
                               <input type="text" className="form-control"/>
                                </>
                              }
                          </div> */}
                    </div>
                  </div>
                </div>
              )
            }
          </div>

        </div>
      </div>

      <div className="form-group row">
        <div className="col-md-9 ml-auto">
          <Link to='/proposal'>
            <button type="button" className="btn btn-secondary">Cancel</button>
          </Link>
          <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Save changes</button>
        </div>
      </div>
    </form>
  )
}