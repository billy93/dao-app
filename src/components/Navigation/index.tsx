import React from 'react'
import { NavLink } from 'react-router-dom'
import Web3Status from '../Web3Status'
  
export default function Navigation({ children }: { children: any }) {
  return (
    <div>
      <div className="header">
        <a href="#" className="navbar-brand"><img src="assets/images/logo.png" alt=""/></a>
        <div className="d-lg-flex d-none px-4 ">
        <NavLink className="nav-link" id={`swap-nav-link`} to={'/mynft'} isActive={(match, location) => location.pathname.toLowerCase() === "/mynft" ||  location.pathname.toLowerCase() === "/"}>
            My NFT
        </NavLink>
        <NavLink className="nav-link" id={`stake-nav-link`} to={'/mint'}>
            Mint NFT
        </NavLink>
          {/* <a href="merge-nft.html" className="nav-link">Merge NFT</a>
          <a href="split-nft.html" className="nav-link">Split NFT</a>
          <a href="stake-nft.html" className="nav-link">Stake NFT</a> */}
        </div>

        <Web3Status />        
      </div>
    
      
      {children}
    </div>          
  )
}