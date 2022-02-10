import React from 'react';
import styled from 'styled-components';
import { TransactionResponse } from "@ethersproject/providers";
import Web3ReactManager from './components/Web3ReactManager';
import { Switch, Route, HashRouter } from 'react-router-dom';
import { useToast } from './components/ToastProvider';
import { IconType } from './components/Icon/IconType';
import TransactionContext from './contexts/TransactionContext';
// import Header from './components/Header';
import { MyNFT } from './pages/MyNFT';
// import { LandingPage } from './pages/LandingPage';
// import Navigation from './components/Navigation';
// import { Footer } from './components/Footer';
import { Mint } from './pages/Mint';
import { Dashboard } from './pages/Dashboard';
import { Proposal } from './pages/Proposal';
import { ProposalCreate } from './pages/Proposal/create';
import { DelegateVote } from './pages/Proposal/delegate';
import Header from './components/Header';
import { ProposalView } from './pages/Proposal/view';

// import { Merge } from './pages/Merge';
// import { Split } from './pages/Split';
// import { Stake } from './pages/Stake/index';

const AppWrapper = styled.div`
`
const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`
const BodyWrapper = styled.div`
`
export const App = () => {
  const { addToast } = useToast();
  const addPendingTransaction = (description: string, txResponse: TransactionResponse) => {
    txResponse.wait().then(txReceipt => {
      addToast(
        txReceipt.status === 1 ? IconType.Success : IconType.Failure,
        `${description} ${txReceipt.status === 1 ? "Completed" : "Failed"}`,
        txReceipt.transactionHash)
    })
  }  
 
  return (
      <HashRouter>
        <AppWrapper>
          <TransactionContext.Provider value={{ addPendingTransaction }}>
            
            
          <header className="header">
            <nav className="navbar navbar-expand-lg px-4 py-2 bg-white shadow"><a href="#" className="sidebar-toggler text-gray-500 mr-4 mr-lg-5 lead"><i className="fas fa-align-left"></i></a><a href="/" className="navbar-brand font-weight-bold text-uppercase text-base">ROOT DAO</a>

            <HeaderWrapper>
              <Header />
            </HeaderWrapper>
            
            </nav>
          </header>
          <div className="d-flex align-items-stretch">
            <div id="sidebar" className="sidebar py-3">
              <div className="text-gray-400 text-uppercase px-3 px-lg-4 py-4 font-weight-bold small headings-font-family">MAIN</div>
              <ul className="sidebar-menu list-unstyled">
                <li className="sidebar-list-item"><a href="index.html" className="sidebar-link text-muted active"><i className="o-home-1 mr-3 text-gray"></i><span>Home</span></a></li>
                <li className="sidebar-list-item"><a href="/#/proposal" className="sidebar-link text-muted"><i className="o-survey-1 mr-3 text-gray"></i><span>Proposals</span></a></li>
              </ul>
            </div>
            <div className="page-holder w-100 d-flex flex-wrap">
            <BodyWrapper style={{"width":"100%"}}>
                <Web3ReactManager>           
                  <Switch> 
                    <Route exact strict path="/" component={Dashboard} />
                    <Route exact strict path="/proposal" component={Proposal} />
                    <Route exact strict path="/proposal/create" component={ProposalCreate} />
                    <Route exact strict path="/proposal/delegate" component={DelegateVote} />
                    <Route exact strict path="/proposal/view/:id" component={ProposalView} />
                    
                    <Route exact strict path="/mynft" component={MyNFT} />
                    <Route exact strict path="/mint" component={Mint} />
                    <Route exact strict path="/mint/:ref" component={Mint} />                    
                    {/* <Route exact strict path="/merge" component={Merge} />
                    <Route exact strict path="/split" component={Split} />
                    <Route exact strict path="/stake" component={Stake} /> */}
                  </Switch>             
                </Web3ReactManager>
            </BodyWrapper>
              <footer className="footer bg-white shadow align-self-end py-3 px-xl-5 w-100">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-6 text-center text-md-left text-primary">
                      <p className="mb-2 mb-md-0">Rootkit Finance &copy; 2020-2022</p>
                    </div>
                    <div className="col-md-6 text-center text-md-right text-gray-400">
                      <p className="mb-0">Design by <a href="https://bootstrapious.com/admin-templates" className="external text-gray-400">Bootstrapious</a></p>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </div>
            
            
            
  


          </TransactionContext.Provider>
        </AppWrapper>
      </HashRouter>
  );
}

export default App;
