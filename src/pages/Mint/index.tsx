import React, { useState, useEffect } from "react"
import 'react-lazy-load-image-component/src/effects/blur.css'
import { useWeb3React } from "@web3-react/core"
import { supportedChain } from "../../utils"
import { NFTTokenService } from "../../services/NFTTokenService"
import { ReferralLink } from "../../components/ReferralLink"
import { useParams } from "react-router-dom"
import { decrypt } from "../../utils/encrypt"
import { Footer } from "../../components/Footer";
import { MintService } from "../../services/MintService"
import { extractErrorMessage } from "../../utils/extractErrorMessage"

import styled from 'styled-components'
import { RowBetween } from "../../components/Row"
import { TYPE } from "../../theme"
import NumericalInput from "../../components/NumericalInput"
import { ButtonPrimary, PendingContent } from "../../components/Button"
import { ErrorMessage } from "../../components/ErrorMessage"
import TransactionCompletedModal from "../../components/TransactionCompletedModal"
import { ReactComponent as eth } from '../../assets/svg/eth.svg'
import { darken } from "polished"

export const ButtonGreen = styled(ButtonPrimary)`
  background-color: ${({ theme }) => theme.primary2};
  color: ${({ theme }) => theme.text1};
  &:hover {
    background-color: ${({ theme }) => darken(0.1, theme.primary2)};
  }
  &:disabled {
    background-color: ${({ theme, altDisabledStyle }) => (altDisabledStyle ? theme.primary2 : theme.bg3)};
    color: ${({ theme, altDisabledStyle }) => (altDisabledStyle ? 'white' : theme.text3)};
    cursor: auto;
    box-shadow: none;
    border: 1px solid transparent;
    outline: none;
    opacity: ${({ altDisabledStyle }) => (altDisabledStyle ? '0.7' : '1')};
  }
`

const Container = styled.div<{ hideInput: boolean }>`
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
`

const LabelRow = styled.div`
  align-items: center;
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
  span:hover {
    cursor: pointer;
  }
`

const ButtonWrapper = styled.div`
  padding: 0.5rem;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  display: flex;
  justify-content: space-between;
  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 1rem`};
`

const InputRow = styled.div`
display: flex;  align-items: center;
  padding: 0.75rem 0.75rem 0.75rem 1rem;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 0.875rem;
  `};
`

const EthSvg = styled(eth)``;

export const Mint = () => {
  const styles: { [key: string]: React.CSSProperties } = {
      section: {
        minHeight: "unset"
      }
  };

  enum MintingStatus {
    None,
    Approving,
    Approved,
    Minting,
    Minted
  }
  
  const { account, library, chainId } = useWeb3React();
  const [referralPoint, setReferralPoint] = useState(0);
  // const theme = useContext(ThemeContext)
  const [status, setStatus] = useState<MintingStatus>(MintingStatus.None);
  const [value, setValue] = useState<string>("");
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [error, setError] = useState("");
  const [completedAction, setCompletedAction] = useState("");
  const [lastTokenId, setLastTokenId] = useState<string>("Loading...");
  const [maxSupply, setMaxSupply] = useState<string>("Loading...");
  const [isAllowMint, setIsAllowMint] = useState<boolean>(); 
  const { ref } = useParams<{ ref: string }>();
  let referralAddress : string | undefined | null = ref ? decrypt(ref) : undefined;
  
  if(referralAddress != undefined){
    localStorage.setItem("referralAddress", referralAddress);
  }
  else{
    referralAddress = localStorage.getItem("referralAddress") != null ? localStorage.getItem("referralAddress") : undefined;
  }


  const getAllowMint = async() => {
    const nftTokenService = new NFTTokenService(library, account!, chainId!);
    setIsAllowMint(await nftTokenService.allowMint());
  }


  const getToken = async() => {
    const nftTokenService = new NFTTokenService(library, account!, chainId!);
    let checkLastTokenId = await nftTokenService.lastTokenId();
    const checkMaxSupply = await nftTokenService.maxSupply();
    if(parseInt(checkLastTokenId.toString()) > parseInt(checkMaxSupply.toString())){
      checkLastTokenId = checkMaxSupply;
    }
    setLastTokenId(checkLastTokenId.toString());
    setMaxSupply(checkMaxSupply.toString());      
  }

  const getReferralPoint = async() => {
    const nftTokenService = new NFTTokenService(library, account!, chainId!);
    let refPoint = await nftTokenService.getReferralPoint();
    setReferralPoint(refPoint);    
  }

  useEffect(() => {
    let abortController = new AbortController();  
    if(account && supportedChain(chainId)) {
      getToken();
      getReferralPoint();
      getAllowMint();
    }
    return () => {  
      abortController.abort();  
    }  
  },  [library, account, chainId]);

  const doMint = async() => {
    try {
      setCompletedAction("Minting success");
      // setPendingAction(`${action === Action.Stake ? "staking" : "unstaking"}...`);
      setStatus(MintingStatus.Minting);

      const service = new MintService(library, account!, chainId!);
      const txResponse = await service.mint(parseInt(value), referralAddress);

      if (txResponse) {
          const receipt = await txResponse.wait()
          if (receipt?.status === 1) {
              setTransactionHash(receipt.transactionHash);
              getToken();
          }
          else {
              setError("Transaction Failed")
          }
      }
      setStatus(MintingStatus.Minted);
      setValue("");
    }
    catch (e) {
        console.log(e)
        const errorMessage = extractErrorMessage(e);
        if(errorMessage) {
            setError(errorMessage);
        }
        setStatus(MintingStatus.None)
    }
  }

  const onUserOutput = (val:any) => {
    setValue(val);
  }

  return (
    <div>
            <TransactionCompletedModal title={completedAction} hash={transactionHash} isOpen={status === MintingStatus.Minted} onDismiss={() => setStatus(MintingStatus.None)} />

      <div className="banner">
          <img src="assets/images/banner.png" alt=""/>
          <div className="overlay"> <span>Mint NFT</span> </div>
      </div>

            <section className="main px-lg-0 px-4 d-flex align-items-center py-5" style={styles.section}>
                <img src="assets/images/bg.png" alt="" className="bg d-lg-flex d-none"/>
                <img src="assets/images/bg-mobile.png" alt="" className="bg d-lg-none d-flex"/>
      
                {account != null ? 
                  isAllowMint ?

                  <div className="container">
                      <div className="w-100 text-center fs-4">Mint</div>
                      <div className="row mx-0 justify-content-center">
                        <p className=" text-center  card-text col-lg-7 pt-2 col-12">Are you ready to mint?</p>
                      </div>
                      <div className="row mx-0 justify-content-center">
                        <p className=" text-center  card-text col-lg-7 pt-2 col-12">0.1 <EthSvg></EthSvg> / NFT</p>
                      </div>
                      <div className="container d-flex pt-4">
                          <div className="row mx-0 justify-content-center w-100 mt-4">
                              <div className="card col-lg-6 col-12">
                                  <div className="card-body d-flex flex-column">
                                      <div className="fs-4 text-center w-100">Mint {account != null ? (`${lastTokenId}/${maxSupply}`) : ``}</div>
        

                                      {/* <span>Mint Amount</span>
                                      <input type="number" min="10" max="1000" className="form-control mt-3"/>
                                      <button className="btn-1 mt-3 py-2">MINT</button> */}

                                      <Container hideInput={false}>
                                        <LabelRow>
                                        
                                          <RowBetween>
                                            <TYPE.body fontWeight={500} fontSize={14}>
                                                Mint Amount
                                              </TYPE.body>
                                          </RowBetween>
                                          
                                        </LabelRow> 
                                        <InputRow>

                                        {/* <input type="number" min="10" max="1000" className="form-control mt-3" value={value} onInput={val => onUserOutput(val)}/> */}
                                        <>
                                            <NumericalInput
                                            className="form-control"
                                            value={value}
                                            onUserInput={val => onUserOutput(val)}
                                            onSubmit={() => {}}              
                                            />
                                            {/* <StyledBalanceMax onClick={onMax}>MAX</StyledBalanceMax>
                                            NFT */}
                                        </>
                                        </InputRow>
                                                  
                                      <ButtonWrapper>
                                        <ButtonGreen disabled={status === MintingStatus.Minting || (lastTokenId == maxSupply)} onClick={() => doMint()}>
                                          {status === MintingStatus.Minting
                                              ? <PendingContent text={"Minting..."}/> 
                                              : `Mint`}
                                        </ButtonGreen>
                                      </ButtonWrapper>
                                      {error ? <ErrorMessage error={error} /> : null}
                                      </Container>

                                      <div className="fs-4 text-center w-100 mt-4">Your referral point : {referralPoint}</div>
        
                                      <ReferralLink address={account!}/>
                                      {/* <span className=" text-danger pt-1">share your referral link to reveal your NFT's christmas trait</span>
                                      <div className="pt-3 card-text">https://mint.holidyareindear.com/ijaejoiasdff89wy498892394u8ds</div> */}
                                  </div>
                              </div>
                          </div>
        
                      </div>
                  </div>
                        : 
                        <div className="w-100 text-center fs-4">Minting is already closed</div>
                      : <div className="w-100 text-center fs-4">Please connect your wallet</div>
                  
                }
            </section>
      
    
      <Footer/>
    </div>
  )
}