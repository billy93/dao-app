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
  var web3 = new Web3(Web3.givenProvider)
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [targets, setTarget] = useState([] as any[]);
  const [targetsContractA, setTargetContractA] = useState([] as any[]);
  const [values, setValues] = useState([] as any[]);
  const [valuesCustom, setValuesCustom] = useState([] as any[]);
  const [callData, setCalldata] = useState([] as any[]);
  const [actions, setActions] = useState([] as any[]);
  const prevAction = usePrevious(actions)
  const [error, setError] = useState(false)
  const [abiFile, setAbiFile] = useState([] as any[])
  const [visibleUploadAbi, setVisibleUploadAbi] = useState(false)
  const [actionsPropos, setActionsPropos] = useState([] as any [])
  const [typeOfParams, setTypeOfParams] = useState([] as any [])
  const [, setNameOfParams] = useState([] as any [])
  const [contract, setContract] = useState("")
  const [actionParam, setActionParam] = useState([] as any[])
  const prevContract = usePrevious(contract)
  const [disabledSelectAct, setDisabledSelectAct] = useState(false)
  // const prevDisabled = usePrevious(disabledSelectAct)

  const postProposal = async (params: any) => {
    if (account && supportedChain(chainId)) {
      const governorService = new GovernorService(library, account!, chainId!);
      try {
       var  res = await governorService.postPropose(params);
       window.location.reload()
      } catch (e) {
        console.log('e', e)
        setError(true)
       }
    }
    return res
  }

  // const postProposeCustomToken = async (params: any) => {
  //   if (account && supportedChain(chainId)) {
  //     const governorService = new GovernorService(library, account!, chainId!);
  //     try {
  //      var  res = await governorService.postProposeCustomToken(params);
  //      window.location.reload()
  //     } catch (e) {
  //       console.log('e', e)
  //       setError(true)
  //      }
  //   }
  //   return res
  // }

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


  useEffect(() => {
    if (contract !== prevContract) {
        getTypeParam()
        getNameParam()
     }
  }, [contract, prevContract])
  
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
    setValues([...values, e.target.value])
  }

  const handleValuesCustom = (e: any) => {
    setValuesCustom([...valuesCustom, e.target.value])
  }

  function getTypeParam (){
    let dataTypes = actionsPropos[0]?.inputs.map((item: any, i: any) => { return item.type })
    setTypeOfParams(dataTypes)
  }

  function getNameParam (){
    let dataName = actionsPropos[0]?.inputs.map((item: any, i: any) => { return item.name })
    setNameOfParams(dataName)
  }

  const handleSubmit = (e: any) => {
  let params ={}
    e.preventDefault()
    if (abiFile?.length !== 0) {
      let encode = web3.eth.abi.encodeParameters(typeOfParams, actionParam);
       params = {
        targets:targetsContractA,
        values: valuesCustom,
        signatures: [ `${contract}$(actionParam,typeOfParams)` ],
        calldata: [encode],
        description: title + ' | '+value
      }
    } else {
        params = {
        targets,
        values,
        signatures:[""],
        calldata: callData,
        description: title + ' | '+value
     }
    }
       postProposal(params);
  };
 
  const handleClose = () => {
    setError(false)
    window.location.reload()
  }
  
  function onChange(event:any) {
        var reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(event.target.files[0]);
    }

    function onReaderLoad(event:any){
        console.log(event.target.result);
        var obj = JSON.parse(event.target.result);
        // alert_data(obj.name, obj.family);
        setAbiFile(obj)
    }
  
  const handleActionsParam = (e: any) => {
    setActionParam([...actionParam, e.target.value])
  }
  const handleTargetContract = (e: any) => {
    let address = e.target.value
    setTargetContractA([...targetsContractA, e.target.value]) 
    if (address?.length !== 0) {
      setVisibleUploadAbi(true)
      setDisabledSelectAct(false)
    } else {
      setVisibleUploadAbi(false)
      setDisabledSelectAct(true)
    }
  }
 const verifyColor = {
  color:'green'
}
 const succedUpload = {
  margin:'0.5rem'
}
  const handleSelectFunction = (e: any) => {
    var methodContract = abiFile.filter((item, idx) => item.name === e.target.value ? item : null)
    console.log('methods', methodContract)
    setContract(e.target.value)
    setActionsPropos(methodContract)
  }
  console.log('a', abiFile)
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
                                  <label className="col-md-3 form-control-label">Value on <span style={{ fontWeight: 'bold' }}>wei</span></label>
                                  <div className="col-md-9">
                                    <input id="inputHorizontalSuccess" type="text" className="form-control form-control-success" name="value" onChange={handleValues} />
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
                                    <input id="inputHorizontalSuccess" type="text" placeholder="Enter the  target Address..." className="form-control form-control-success"  onChange={handleTargetContract}/>
                                  </div>
                                </div>
                                <div className="form-group">
                                  {/* <input type="file" className="form-control-file" id="exampleFormControlFile1" onChange={onChange}/> */}
                                      <div className="file-drop-area"> <span className="choose-file-button">Choose files drop Abi files here</span> <span className="file-message"> </span> <input className="file-input" type="file" multiple  onChange={onChange} disabled={!visibleUploadAbi ? true : false}/>
                                      </div>
                                      {abiFile?.length !==0 &&    
                                    <div style={succedUpload}>
                                      <i className="fas fa-check-circle" style={verifyColor}></i>  File uploaded
                                    </div>
                                    }
                                </div>
                                <div className="form-group row">
                                  <label className="col-md-3 form-control-label bold">Contract Method</label>
                                  <div className="col-md-9">
                                    <select className="form-control" id="exampleFormControlSelect1"  onChange={handleSelectFunction} value={contract} disabled={disabledSelectAct ? true : false}>
                                      {
                                        abiFile?.map((item:any, i:any) => (
                                          item.type ==='function' && <option key={i} value={ item.name}>{ item.name}</option>
                                        ))
                                      }
                                    </select>
                                  </div>
                                </div>
                                {
                                  actionsPropos?.length !== 0 && (
                                    actionsPropos[0]?.inputs?.map((actions: any, i: any) => (
                                      <>
                                        <div className="form-group row">
                                          <label className="col-md-3 form-control-label" key={i}>{actions.name}</label>
                                          <div className="col-md-9">
                                            <input key={i} id="inputHorizontalSuccess" type="text" placeholder={`please input ${actions.type} ...`} className="form-control form-control-success" onChange={handleActionsParam} name={actions.name} disabled={disabledSelectAct ? true :false}/>
                                          </div>
                                       </div>
                                      </>
                                    ))
                                  )
                                }
                                <div className="form-group row">
                                  <label className="col-md-3 form-control-label">Value on<span style={{ fontWeight: 'bold' }}>$ETH</span></label>
                                  <div className="col-md-9">
                                    <input id="inputHorizontalSuccess" type="text" placeholder="0" className="form-control form-control-success"  onChange={handleValuesCustom}/>
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
      {
        error &&
        <div className="alert alert-danger">
            <button type="button" className="close" data-dismiss="alert" onClick={handleClose}>&times;</button>
          <strong>Failed!</strong> create proposal is failed.
        </div>
     }
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