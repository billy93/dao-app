import React from "react"
import { ProposalForm } from "./form"

export const ProposalCreate = () => {

    return (
        <div className="container-fluid px-xl-5">
        <section className="py-5">
          <div className="row">
          
            <div className="col-lg-12 mb-5">
                <div className="card">
                  <div className="card-header">
                    <h3 className="h6 text-uppercase mb-0">Create a New Proposal</h3>
                  </div>
                  <div className="card-body">
                    <ProposalForm></ProposalForm>
                  </div>
                </div>
              </div>

            
          </div>
        </section>
      </div>
    )
}