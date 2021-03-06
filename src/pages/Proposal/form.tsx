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
  const [actions, setActions] = useState([] as any[]);
  const prevAction = usePrevious(actions)
  const [error, setError] = useState(false)

  const postProposal = async (params: any) => {
    if (account && supportedChain(chainId)) {
      const governorService = new GovernorService(library, account!, chainId!);
      try {
         let trx = await governorService.postPropose(params);
         await trx.wait();

        window.location.reload()
      } catch (e) {
        console.log('e', e)
        setError(true)
      }
    }
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
      // setCalldata(calldata);
    }

  }, [actions, prevAction])

  function addAction() {
    var data = [...actions];
    data.push({
      tab: 1,
      target: "",
      value: "",
      targetCustom: "",
      valueCustom: "",
      abi: null,
      method: "",
      params: null
    });
    setActions(data);
  }

  function removeAction(index: any) {
    const data = actions.filter((item, idx) => idx !== index);
    setActions(data);
  }

  const handleText = (e: any) => {
    setTitle(e.target.value)
  }

  const selectTab = (index: any, tabIndex: any) => {
    let data = [...actions];
    data[index].tab = tabIndex;

    if(tabIndex == 1){
      data[index].targetCustom = "";
      data[index].valueCustom = "";
    }else if(tabIndex == 2){
      data[index].target = "";
      data[index].value = "";
    }

    setActions(data);
  }

  const handleTarget = (e: any, index: any) => {
    let data = [...actions];
    data[index].target = e.target.value;
    setActions(data);
  }

  const handleValues = (e: any, index: any) => {
    let data = [...actions];
    data[index].value = e.target.value;
    setActions(data);
  }

  const handleTargetContract = (e: any, index: any) => {
    let data = [...actions];
    data[index].targetCustom = e.target.value;
    setActions(data);
  }

  const handleValuesCustom = (e: any, index: any) => {
    let data = [...actions];
    data[index].valueCustom = e.target.value;
    setActions(data);
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    
    let targets: any[] = [];
    let values: any[] = [];
    let signatures: any[] = [];
    let calldata: any[] = [];;
    let description = title + ' | ' + value;

    for(let i=0;i<actions.length;i++){
      if(actions[i].tab == 1){
        targets.push(actions[i].target);
        values.push(actions[i].value == "" ? "0" : actions[i].value);
        signatures.push("");
        calldata.push("0x");
      }
      else if(actions[i].tab == 2){
        targets.push(actions[i].targetCustom);
        values.push(actions[i].valueCustom == "" ? "0" : actions[i].valueCustom);

        let dataTypes = actions[i].params.inputs.map((item: any, i: any) => { return item.type })
        let encode = web3.eth.abi.encodeParameters(dataTypes, actions[i].paramValues);

        signatures.push(`${actions[i].method}(${dataTypes})`)
        calldata.push(encode);
      }
    }

    let params = {
      targets, values, signatures, calldata, description
    };
    console.log(params)
    postProposal(params);
  };

  const handleClose = () => {
    setError(false)
    window.location.reload()
  }

  function onChange(event: any, index: any) {
    var reader = new FileReader();


    const onReaderLoad = (event: any) => {
      console.log(event.target.result);
      var obj = JSON.parse(event.target.result);
  
      let data = [...actions];
      data[index].abi = obj;
      setActions(data);
    };
    reader.onload = onReaderLoad;
    reader.readAsText(event.target.files[0]);
  }

  // function onReaderLoad(event: any) {
  //   console.log(event.target.result);
  //   var obj = JSON.parse(event.target.result);

  //   let data = [...actions];
  //   data[index].abi = e.target.value;
  //   setActions(data);

  //   // alert_data(obj.name, obj.family);
  //   setAbiFile(obj)
  // }

  const handleActionsParam = (e: any, i: any, idx: any) => {
    let data = [...actions];
    data[i].paramValues[idx] = e.target.value;
    setActions(data);
  }

  const verifyColor = {
    color: 'green'
  }
  const succedUpload = {
    margin: '0.5rem'
  }
  const handleSelectFunction = (e: any, index: any) => {
    let data = [...actions];
    data[index].method = e.target.value;

    var methodContract = data[index].abi.filter((item: { name: any; }, idx: any) => item.name === e.target.value ? item : null)
    data[index].params = methodContract[0];
    console.log('methods', data[index].params)

    data[index].paramValues = []
    for(let i=0;i<data[index].params.inputs.length;i++){
      data[index].paramValues.push("");
    }


    setActions(data);
    // setContract(e.target.value) 
    // setActionsPropos(methodContract)
  }

  // const handleActionsParam = (e: any) => {
    // setActionParam([...actionParam, e.target.value])
  // }

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
                <div className="card" id={`` + i} key={`` + i}>
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

                  <div id={`collapse` + i} className="collapse" aria-labelledby={`heading` + i} data-parent={`#accordion`}>
                    <div className="card-body">
                      <nav>
                        <div className="nav nav-tabs" id={"nav-tab"+i} role="tablist">
                          <a className="nav-item nav-link active" id={'nav-parameter-tab'+i} data-toggle="tab" href={"#nav-parameter"+i} role="tab" aria-controls={"nav-parameter"+i} aria-selected="true" onClick={e => selectTab(i, 1)}>Transfer Token</a>
                          <a className="nav-item nav-link" id={`nav-ca-tab`+i} data-toggle="tab" href={"#nav-ca"+i} role="tab" aria-controls={"nav-ca"+i} aria-selected="false" onClick={e => selectTab(i, 2)}>Add Custom Token</a>
                        </div>
                      </nav>
                      <div className="tab-content" id={"nav-tabContent"+i}>
                        <div className="tab-pane fade show active" id={`nav-parameter`+i} role="tabpanel" aria-labelledby={'nav-parameter-tab'+i}>
                          <div className="card-body">
                            <div className="col-lg-12 mb-5">
                              {/* <p>Remember you are delegating all your votes. To get your votes back you have to delegate to yourself again.</p> */}
                              <div className="form-horizontal">
                                <div className="form-group row">
                                  <label className="col-md-3 form-control-label bold">Target Wallet Address</label>
                                  <div className="col-md-9">
                                    <input id="inputHorizontalSuccess" type="text" value={actions[i].target} placeholder="Enter the  target Address..." className="form-control form-control-success" name="target" onChange={e => handleTarget(e, i)} />
                                  </div>
                                </div>
                                <div className="form-group row">
                                  <label className="col-md-3 form-control-label">Value on <span style={{ fontWeight: 'bold' }}>wei</span></label>
                                  <div className="col-md-9">
                                    <input id="inputHorizontalSuccess" type="text" value={actions[i].value} className="form-control form-control-success" name="value" onChange={e => handleValues(e, i)} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="tab-pane fade show " id={`nav-ca`+i} role="tabpanel" aria-labelledby={`nav-ca-tab`+i}>
                          <div className="card-body">
                            <div className="col-lg-12 mb-5">
                              <div className="form-horizontal">
                                <div className="form-group row">
                                  <label className="col-md-3 form-control-label bold">Target Contract Address</label>
                                  <div className="col-md-9">
                                    <input id="inputHorizontalSuccess" type="text" value={actions[i].targetCustom} placeholder="Enter the  target Address..." className="form-control form-control-success" onChange={e => handleTargetContract(e, i)} />
                                  </div>
                                </div>
                                <div className="form-group">
                                  <div className="file-drop-area"> 
                                  <span className="choose-file-button">Choose files drop Abi files here</span> <span className="file-message"> </span> 
                                  <input className="file-input" type="file" multiple onChange={e => onChange(e, i)} />
                                  </div>
                                  { actions[i].abi !== null &&
                                    <div style={succedUpload}>
                                      <i className="fas fa-check-circle" style={verifyColor}></i>  File uploaded
                                    </div>
                                  } 
                                </div>
                                <div className="form-group row">
                                  <label className="col-md-3 form-control-label bold">Contract Method</label>
                                  <div className="col-md-9">
                                    <select 
                                    className="form-control" 
                                    id="exampleFormControlSelect1" 
                                    onChange={e => handleSelectFunction(e, i)} 
                                    value={actions[i].method} >
                                      {
                                        actions[i].abi?.map((item: any, i: any) => (
                                          item.type === 'function' && <option key={i} value={item.name}>{item.name}</option>
                                        ))
                                      }
                                    </select>
                                  </div>
                                </div>
                                {
                                    actions[i].params?.inputs?.map((act: any, idx: any) => (
                                        <div key={idx} className="form-group row">
                                          <label className="col-md-3 form-control-label" >{act.name}</label>
                                          <div className="col-md-9">
                                            <input id="inputHorizontalSuccess" type="text" value={actions[i].paramValues[idx]} placeholder={`please input ${act.type} ...`} className="form-control form-control-success" onChange={e => handleActionsParam(e, i, idx)} name={act.name} />
                                          </div>
                                        </div>
                                    ))                                  
                                } 
                                <div className="form-group row">
                                  <label className="col-md-3 form-control-label">Value on <span style={{ fontWeight: 'bold' }}>wei</span></label>
                                  <div className="col-md-9">
                                    <input id="inputHorizontalSuccess" type="text" value={actions[i].valueCustom} placeholder="0" className="form-control form-control-success" onChange={e => handleValuesCustom(e, i)} />
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