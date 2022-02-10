import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import { Link } from 'react-router-dom';


export const ProposalForm = () => {
    const [value, setValue] = useState('');
    const [actions, setActions] = useState([] as any[]);

    function addAction(){
      var data = actions.filter((item, idx) => {return true});
      data.push([1]);
      setActions(data);
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
                          Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
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