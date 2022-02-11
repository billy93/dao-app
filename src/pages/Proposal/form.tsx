import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import { Link } from 'react-router-dom';


export const ProposalForm = () => {
    const [value, setValue] = useState('');
    const [actions, setActions] = useState([] as any[]);
  const [isSendToken, setIsSendToken] = useState<boolean>(false);
  
    function addAction(){
      var data = actions.filter((item, idx) => {return true});
      data.push([1]);
      setActions(data);
    }
  console.log('action', actions)
  console.log('isSendToken', isSendToken)
  const handleSubAction = (key: any) => (action: any) => {
     setIsSendToken(true)
   }
    function removeAction(index : any){
      const data = actions.filter((item, idx) => idx !== index);
      setActions(data);
    }
  
    return (
        <form className="form-horizontal">
            <div className="form-group row">
              <label className="col-md-3 form-control-label">Title</label>
              <div className="col-md-9">
                  <input type="text" className="form-control"/>
              </div>
            </div>
            
            <div className="line"></div>
            
            <div className="form-group row">
              <label className="col-md-3 form-control-label">Description</label>
              <div className="col-md-9">
                <ReactQuill theme="snow" value={value} onChange={setValue} style={{"height": "200px"}}/>
              </div>
            </div>
            
            <div className="line"></div>
            
            <div className="form-group row">
              <label className="col-md-3 form-control-label">Actions</label>
              <div className="col-md-9">
                
                <div className="form-group row">
                  <button className="btn btn-primary" onClick={(e) => addAction()}>
                      Add Action
                  </button>
                </div>

                <div id="accordion">
                  {
                    actions.map((act, i) =>
                    <div className="card">
                      <div className="card-header" id={`heading`+i}>
                        <div className="row">
                          <div className="col-auto mr-auto">
                            <h5 className="mb-0">
                              <button className="btn btn-primary" data-toggle="collapse" data-target={`#collapse`+i} aria-expanded="true" aria-controls={`collapse`+i}>
                                Action #{i+1}
                              </button>
                            </h5>
                          </div>
                          <div className="col-auto">
                            <button type="button" className="btn btn-danger float-end" onClick={(e) => {removeAction(i)}}>Remove Action</button>
                          </div>
                        </div>
                      </div>
              
                      <div id={`collapse`+i} className="collapse" aria-labelledby={`heading`+i} data-parent="#accordion">
                        <div className="card-body">
                            <div style={{display:'flex', flexDirection:'column'}}>
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
                          </div>
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
                  <button type="submit" className="btn btn-primary">Save changes</button>
              </div>
            </div>
        </form>
    )
}