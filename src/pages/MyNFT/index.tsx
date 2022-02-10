import React, { useEffect, useState } from "react"
import styled from "styled-components"
import 'react-lazy-load-image-component/src/effects/blur.css'

import { useWeb3React } from "@web3-react/core"
import { darken } from 'polished'
import { supportedChain } from "../../utils"
import { NFTTokenService } from "../../services/NFTTokenService"
import { NFT } from "../../dtos/NFT"
import { Footer } from "../../components/Footer"
import { ReactComponent as eth } from '../../assets/svg/eth.svg'

export const Option = styled.button<{ active: boolean }>`
  align-items: center;
  margin-right: 5px;
  font-size:1em;
  font-weight: ${({ active, theme }) => (active ? '600' : '500')};
  padding: 0.75em 0.75em 0.8em 0.75em;
  border-radius: 1em; 
  border: 0px;
  outline: none;
  cursor: pointer;
  pointer-events: ${({ active }) => (active ? '' : 'none')};
  background-color: ${({ active, theme }) => (active ? theme.primary1 : 'black')};
  color: ${({ active, theme }) => (active ? theme.text1 : theme.text2)};
  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }`


enum RevealStatus {
  None,
  Revealing,
  Revealed
}

const EthSvg = styled(eth)``;

export const MyNFT = () => {
  const { account, library, chainId } = useWeb3React();
  const [myNft, setMynft] = useState<NFT[]>([]); 
  const [myRevealNft, setMyRevealNft] = useState<NFT[]>([]);
  const [myReferralPoint, setMyReferralPoint] = useState(0);
  const [status, setStatus] = useState<RevealStatus>(RevealStatus.None);
  const [isReveal, setIsReveal] = useState<boolean>(false);

  const getIsReveal = async() => {
    if(account && supportedChain(chainId)) {
      const nftTokenService = new NFTTokenService(library, account!, chainId!);
      setIsReveal(await nftTokenService.isRevealed());
    }
  }

  const getMyRevealNft = async() => {
    if(account && supportedChain(chainId)) {
      const nftTokenService = new NFTTokenService(library, account!, chainId!);
      setMyRevealNft(await nftTokenService.getRevealNft());
    }
  }

  const getMyReferralPoint = async() => {
    if(account && supportedChain(chainId)) {
      const nftTokenService = new NFTTokenService(library, account!, chainId!);
      let refPoint = await nftTokenService.getReferralPoint();
      console.log("Ref point : ", refPoint);
      setMyReferralPoint(refPoint);
    }
  }

  useEffect(() => {
    let abortController = new AbortController();  

    if(account && supportedChain(chainId)) {
      getMyRevealNft(); 
      getMyReferralPoint();
      getIsReveal();
    }

    return () => {  
      abortController.abort();  
    } 
  },  [library, account, chainId]);

    
  const revealNft = async(tokenId: string) => {
    console.log("Reveal NFT ", tokenId);
    const nftTokenService = new NFTTokenService(library, account!, chainId!);
    setStatus(RevealStatus.Revealing); 
    await nftTokenService.revealNft(tokenId);
    getMyRevealNft(); 
    setStatus(RevealStatus.None);
  }

  useEffect(() => {
    let abortController = new AbortController();  

    if(account && supportedChain(chainId)) {
      const nftTokenService = new NFTTokenService(library, account!, chainId!); 
      const getToken = async() => {
        const myToken = await nftTokenService.getWalletOfOwner(account);
        setMynft(myToken);
      }
      getToken();
    }

    return () => {  
      abortController.abort();  
    } 
  },  [library, account, chainId]);

  const NFTCard = (props:any) => {
    const data = myRevealNft.filter(e => e.tokenId == props.id)[0];

    return (
      <div className="col-lg-3 col-md-6 p-3">

        <div className="card">
          <img src={props.image} className="card-img-top" alt="..." onClick={() => {}}/>
          <div className="card-body pt-2">
            <h5 className="card-title">
            {!isReveal ? 
              <p>{props.name} {data != null ? `- ${data.xmasTrait}` : ``} - 0.1 <EthSvg/></p> : 
              <p>{props.name} - {props.xmas}</p>
            }
            </h5>
            <div className="d-flex justify-content-between align-items-center">

            {!isReveal && data == null && myReferralPoint > 0 ? 
              <Option active={status == RevealStatus.None} onClick={() => revealNft(props.id)}>
                  {status == RevealStatus.Revealing ? `Revealing...` : `Reveal`}
              </Option>
              : <></>}
            </div>                  
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="banner">
        <img src="assets/images/banner.png" alt=""/>
        <div className="overlay"> <span>My NFT</span> </div>
      </div>

      <section className="main px-lg-0 px-4">
        <img src="assets/images/bg.png" alt="" className="bg d-lg-flex d-none"/>
        <img src="assets/images/bg-mobile.png" alt="" className="bg d-lg-none d-flex"/>
        <div className="container">
          <div className="w-100 text-center pt-5 fs-4">My NFT</div>
          <div className="row mx-0 justify-content-center">
            <p className=" text-center card-text col-lg-7 pt-2 col-12">The NFTs will be blackout until the Mint closes. You will however have the option to use your referral points to see your special layers. Good luck</p>
          </div>

          <div className="row mx-0 pt-lg-5 pt-3 pb-4">
          {myNft.length > 0 ?

                           
            myNft.map((nft:NFT, i:any) => 
                <NFTCard key={i} image={nft.imageUrl} name={nft.name} xmas={nft.xmasTrait} id={nft.tokenId}>
                </NFTCard>                    
            )
          

          : <p>You dont have any NFT</p>}
          </div>
          

          {/* <div className="d-flex w-100 justify-content-center pb-5">
            <button className="btn-1 px-4 py-2">Load More</button>
          </div> */}
        </div>
      </section>

      <Footer/>

    </div>
  )
}