import React from "react"
import { NavLink } from "react-router-dom"


export const Footer = () => {
    return (
      <div>
          <div className="footer pb-5 pt-4">
              <div className="w-100 text-center  fs-4">Holiday Reindeers</div>

              <div className="d-flex justify-content-center align-items-center flex-wrap pt-4">
                  <a href="https://www.instagram.com/holidayreindeers" className="social-links m-2 "><i className="fa fa-instagram"></i></a>
                  <a href="https://twitter.com/holsreindeers" className="social-links m-2 "><i className="fa fa-twitter"></i></a>
                  <a href="https://medium.com/@holidayreindeers" className="social-links m-2 "><i className="fab fa-medium"></i></a>
                  <a href="https://discord.com/invite/j6rEEPTa" className="social-links m-2 "><i className="fab fa-discord"></i></a>
                  <a href="https://t.me/holidayreindeers" className="social-links m-2 "><i className="fa fa-telegram"></i></a>
                  <a href="https://holidayreindeers.com" className="social-links m-2 "><i className="fa fa-globe"></i></a>
              </div>
          </div>

        <div className="footer-bottom">
            <div className="container">
                <div className="d-flex w-100 pb-4 flex-lg-row flex-column  justify-content-between align-items-center">
                    <span className="card-text">2021 Holiday Reindeer, all rights reserved</span>
                    <span className="card-text">Terms & Conditions | Privacy Policy</span>
                </div>
            </div>
        </div>


        <div className="header-bottom d-lg-none d-flex">
          <NavLink className="link" id={`swap-nav-link`} to={'/mynft'} isActive={(match, location) => location.pathname.toLowerCase() === "/mynft" ||  location.pathname.toLowerCase() === "/"}>
            <div><img src="assets/images/box.png" alt=""/></div> <span>My NFT</span>
          </NavLink>
          <NavLink className="link" id={`stake-nav-link`} to={'/mint'} isActive={(match, location) => location.pathname.toLowerCase() === "/mint"}>
            <div><img src="assets/images/mint.png" alt=""/></div> <span>Mint NFT</span> 
          </NavLink>            
        </div>
      </div>
    )
}