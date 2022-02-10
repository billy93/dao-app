import React, {useContext, useEffect, useState} from "react"
import styled, { ThemeContext } from "styled-components"
import { PrimaryCard } from "../../components/Card"
import 'react-lazy-load-image-component/src/effects/blur.css'
import { ButtonPrimary, PendingContent } from "../../components/Button";
import { darken, lighten } from 'polished'
import { RowBetween } from "../../components/Row";
import { TYPE } from "../../theme";
import NFTSelectInput from "../../components/NFTSelectInput";
import { NFT } from "../../dtos/NFT";
import { useWeb3React } from "@web3-react/core";
import { supportedChain } from "../../utils";
import { NFTTokenService } from "../../services/NFTTokenService";
import TransactionCompletedModal from "../../components/TransactionCompletedModal";
import { SplitService } from "../../services/SplitService";
import { ErrorMessage } from "../../components/ErrorMessage";

const PageWrapper = styled.div`
    padding-top: 1.5em;

 ${({ theme }) => theme.mediaWidth.upToSmall`
    padding-top:0em;
 `};
`

const ButtonWrapper = styled.div`
  /* background-color: ${({ theme }) => theme.bg2}; */
  padding: 0.5rem;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  display: flex;
  justify-content: space-between;
  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 1rem`};
`

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

const Title = styled.div`
    padding: 0.5em 0;
    font-size: 2em;
    letter-spacing:0.025em;
    text-align: center;
`

const CardContent = styled.div`
    display: grid;
    grid-gap: 1.5em;
    padding-bottom: 0.5em;
    width: 26em;
    margin:auto;
 ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 100%;
    font-size: 0.75em;
 `};
`

const InputRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: 0.75rem 0.75rem 0.75rem 1rem;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 0.875rem;
  `};
`

const Container = styled.div<{ hideInput: boolean }>`
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  border: 1px solid ${({ theme }) => lighten(0.04, theme.bg2)};
  background-color: ${({ theme }) => theme.bg1};
`

const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.text1};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.text2)};
  }
`
enum SplitStatus {
  None,
  Approving,
  Approved,
  Splitting,
  Splitted
}
export const Split = () => {
  const theme = useContext(ThemeContext)
  const [status, setStatus] = useState<SplitStatus>(SplitStatus.None);
  // const [error, setError] = useState("");
  const [myNft, setMynft] = useState<NFT[]>([]); 
  const { account, library, chainId } = useWeb3React();
  const [splitNft, setSplitNft] = useState<NFT>();
  const [completedAction, setCompletedAction] = useState("");
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [error, setError] = useState("");
  const [isApproved, setIsApproved] = useState<boolean>(); 
  const [isAllowSplit, setIsAllowSplit] = useState<boolean>(); 

  const getAllowSplit = async() => {
    const nftTokenService = new NFTTokenService(library, account!, chainId!);
    setIsAllowSplit(await nftTokenService.allowSplit());
  }

  const getIsApproved = async() => {
    const nftTokenService = new NFTTokenService(library, account!, chainId!);
    const approved = await nftTokenService.isApprovedForAllElfStation();
    setIsApproved(approved);
  }

  const getToken = async() => {
    const nftTokenService = new NFTTokenService(library, account!, chainId!);
    const myToken = await nftTokenService.getMergedNft(account!);
    setMynft(myToken);
    if(myToken != null && myToken.length > 0){
      setSplitNft(myToken[0]);
    }
  }

  useEffect(() => {
    if(account && supportedChain(chainId)) {
      getIsApproved();
      getAllowSplit();
    }
  },  [library, account, chainId]);

  useEffect(() => {
    if(account && supportedChain(chainId)) {
      getToken();
    }
  },  [library, account, chainId]);
  
  const doApprove = async() => {
    setCompletedAction("Approve complete");
    setStatus(SplitStatus.Approving); 
    const nftTokenService = new NFTTokenService(library, account!, chainId!);
    const txResponse = await nftTokenService.setApprovalForAllElfStation();
    if (txResponse) {
      const receipt = await txResponse.wait()
      if (receipt?.status === 1) {
          setTransactionHash(receipt.transactionHash);
          setStatus(SplitStatus.Approved);
          setIsApproved(true);
      }
      else {
          setError("Transaction Failed");
          setStatus(SplitStatus.None);
      }
    }
    else{
      setStatus(SplitStatus.None);
    }
  };

  const doSplit = async() => {
    if(splitNft != null){
      setCompletedAction("Split complete");
      setStatus(SplitStatus.Splitting);

      console.log("Ready to split");
      const splitService = new SplitService(library, account!, chainId!);
      const txResponse = await splitService.split(splitNft.tokenId);
      if (txResponse) {
        const receipt = await txResponse.wait();
        if(receipt != null){
          if (receipt?.status === 1) {
              setTransactionHash(receipt.transactionHash);
              setStatus(SplitStatus.Splitted);
          }
          else {
              setError("Transaction Failed");
              setStatus(SplitStatus.None);
          }
        }
        else {
          setError("Transaction Failed");
          setStatus(SplitStatus.None);
        }
      }
      else{
        setStatus(SplitStatus.None);
      }
    }
    else{
      setError("Transaction Failed");
      setStatus(SplitStatus.None);

    }
  }

  const onUserTokenIdSelected = (i: any, val:any) => {
    setSplitNft(val);
  }

  return (
    <PageWrapper>
      <TransactionCompletedModal title={completedAction} hash={transactionHash} isOpen={status === SplitStatus.Splitted} onDismiss={() => {window.location.reload(); setStatus(SplitStatus.None)}} />

      <PrimaryCard width="auto" margin="auto">
        <CardContent>
          <Title>
            Split
          </Title>

          { account != null ? 
              isApproved ?
                isAllowSplit ? 
                  myNft.length > 0 ?
                    <Container hideInput={false}>
                      <LabelRow>            
                        <RowBetween>
                          <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                            Select NFT
                          </TYPE.body>
                        </RowBetween>
                      </LabelRow> 
                      <InputRow>
                        <NFTSelectInput options={myNft} onUserTokenIdSelected={onUserTokenIdSelected} index={0}></NFTSelectInput>
                      </InputRow>


                      <ButtonWrapper>
                        {
                            isApproved ? 

                            <ButtonPrimary disabled={status === SplitStatus.Splitting} onClick={() => doSplit()}>
                            {status === SplitStatus.Splitting
                                ? <PendingContent text={"Splitting..."}/> 
                                : `Split`}
                            </ButtonPrimary> :
                            <ButtonPrimary disabled={status === SplitStatus.Approving} onClick={() => doApprove()}>
                            {status === SplitStatus.Approving
                                ? <PendingContent text={"Approving..."}/> 
                                : `Approve`}
                            </ButtonPrimary>
                        }
                      </ButtonWrapper>
                      {error ? <ErrorMessage error={error} /> : null}
                    </Container>
                  : <Title>You don't have any NFT to split</Title> 
                : <Title>Splitting is currently unavailable</Title> 
              : <ButtonWrapper>                                
                <ButtonPrimary disabled={status === SplitStatus.Approving} onClick={() => doApprove()}>
                    {status === SplitStatus.Approving
                        ? <PendingContent text={"Approving..."}/> 
                        : `Approve`}
                    </ButtonPrimary>            
                </ButtonWrapper>
            : <Title>Please connect your wallet</Title>}
        </CardContent>
      </PrimaryCard>

      {/* <UpgradeModal
        modalOpen={modalUpgradeOpen}
        toggleInfoModal={toggleUpgradeModal}
        artId={artId}
      /> */}
    </PageWrapper>
  )
}