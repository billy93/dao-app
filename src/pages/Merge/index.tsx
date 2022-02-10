import React, { useContext, useEffect, useState } from "react"
import styled, { ThemeContext } from "styled-components"
import { PrimaryCard } from "../../components/Card"
import 'react-lazy-load-image-component/src/effects/blur.css'
import { ButtonPrimary, PendingContent } from "../../components/Button";

import { darken, lighten } from 'polished'
import { MergeService } from "../../services/MergeService";
import { RowBetween } from "../../components/Row";
import { TYPE } from "../../theme";
import NumericalInput from "../../components/NumericalInput";
import { ErrorMessage } from "../../components/ErrorMessage";
import { supportedChain } from "../../utils";
import { useWeb3React } from "@web3-react/core";
import { NFT } from "../../dtos/NFT";
import { NFTSelectInput } from "../../components/NFTSelectInput";
import { NFTTokenService } from "../../services/NFTTokenService";
import TransactionCompletedModal from "../../components/TransactionCompletedModal";

const PageWrapper = styled.div`
    padding-top: 1.5em;
    margin-bottom:100px;

 ${({ theme }) => theme.mediaWidth.upToSmall`
    padding-top:0em;
 `};
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
const ButtonWrapper = styled.div`
  /* background-color: ${({ theme }) => theme.bg2}; */
  padding: 0.5rem;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  display: flex;
  justify-content: space-between;
  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 1rem`};
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

enum MergeStatus {
  None,
  Approving,
  Approved,
  Merging,
  Merged
}

export const Merge = () => {
  const theme = useContext(ThemeContext)

  const { account, library, chainId } = useWeb3React();
  const [value, setValue] = useState<string>("");
  const [merge, setMerge] = useState<NFT[]>([]);
  const [status, setStatus] = useState<MergeStatus>(MergeStatus.None);
  const [error, setError] = useState("");
  const [myNft, setMynft] = useState<NFT[]>([]); 
  const [isApproved, setIsApproved] = useState<boolean>(); 
  const [isAllowMerge, setIsAllowMerge] = useState<boolean>(); 
  const [completedAction, setCompletedAction] = useState("");
  const [transactionHash, setTransactionHash] = useState<string>("");

  const getAllowMerge = async() => {
    const nftTokenService = new NFTTokenService(library, account!, chainId!);
    setIsAllowMerge(await nftTokenService.allowMerge());
  }
  
  const getIsApproved = async() => {
    const nftTokenService = new NFTTokenService(library, account!, chainId!);
    const approved = await nftTokenService.isApprovedForAllElfStation();
    setIsApproved(approved);
  }

  const getToken = async() => {
    const nftTokenService = new NFTTokenService(library, account!, chainId!);
    const myToken = await nftTokenService.getWalletOfOwner(account!);
    setMynft(myToken);
  }

  useEffect(() => {
    if(account && supportedChain(chainId)) {
      getIsApproved();
      getAllowMerge();
    }
  },  [library, account, chainId]);

  useEffect(() => {
    if(account && supportedChain(chainId)) {
      getToken();
    }
  },  [library, account, chainId]);
  
  useEffect(() => {
    if(account && supportedChain(chainId)) {
      setError("");
      setStatus(MergeStatus.None);
    }
  },  [library, account, chainId]);
  
  const onUserOutput = (val:any) => {
    setValue(val);

    let mergeAmount = parseInt(val);
    let totalMerge:NFT[] = [];
    for(let x=0;x<mergeAmount;x++){
      totalMerge.push(myNft[0]);
    }
    setMerge(totalMerge);
  }
  
  const onUserTokenIdSelected = (i: any, val:any) => {
    let curData: NFT[] = JSON.parse(JSON.stringify(merge));
    curData[parseInt(i)].tokenId = val;
    setMerge(curData);
  }

  const validateInput = () => {
    let tokenId = merge.map((e, i) => e.tokenId);
    let xmasTraits = [];

    let canMerge = true;
    for(let x=0;x<tokenId.length;x++){
      if(canMerge){
        let selected = myNft.filter(e => e.tokenId == tokenId[x])[0];
        if(selected.mergedMetadata != null && selected.mergedMetadata.length > 0){
            for(let y=0;y<selected.mergedMetadata.length;y++){ 
              if(xmasTraits.indexOf(selected.mergedMetadata[y].xmasTrait) != -1){
                  canMerge = false;
                  break;
              }
              xmasTraits.push(selected.mergedMetadata[y].xmasTrait);
            }            
        }
        else{
          if(xmasTraits.indexOf(selected.xmasTrait) != -1){
            canMerge = false;
            break;
          }
          xmasTraits.push(selected.xmasTrait);
        }
      } 
    }
    return !canMerge;
  }

  const doApprove = async() => {
    setCompletedAction("Approve complete");
    setStatus(MergeStatus.Approving);
    const nftTokenService = new NFTTokenService(library, account!, chainId!);
    const txResponse = await nftTokenService.setApprovalForAllElfStation();
    if (txResponse) { 
      const receipt = await txResponse.wait()
      if (receipt?.status === 1) {
          setTransactionHash(receipt.transactionHash);
          setStatus(MergeStatus.Approved);
          setIsApproved(true);
      }
      else {
          setError("Transaction Failed");
          setStatus(MergeStatus.None);
      }
    }
    else{
      setStatus(MergeStatus.None);
    }
  };

  const checkIfDuplicateExists = (arr: any) => {
    return new Set(arr).size !== arr.length
  }

  const doMerge = async() => {
    setError("");
    setCompletedAction("Merge complete");
    setStatus(MergeStatus.Merging);

    let tokenId = merge.map((e, i) => e.tokenId);
    if(!checkIfDuplicateExists(tokenId)){
      const mergeService = new MergeService(library, account!, chainId!);
      const txResponse = await mergeService.merge(tokenId);
      if (txResponse) {
        const receipt = await txResponse.wait()
        if (receipt?.status === 1) {
            setTransactionHash(receipt.transactionHash);
            setStatus(MergeStatus.Merged);
        }
        else {
            setError("Transaction Failed");
            setStatus(MergeStatus.None);
        }
      }
      else{
        setStatus(MergeStatus.None);
      }
    }
    else{
      setStatus(MergeStatus.None);
      setError("Cannot merge same art");
    }
    // if(res.status == 500){
    //   setError("Error, please try again or check your selected NFT");
    //   setStatus(MergeStatus.None);
    // }
    // else{
    //   setStatus(MergeStatus.Merged);
    // }
  }

  
  return (
    <PageWrapper>
      <TransactionCompletedModal title={completedAction} hash={transactionHash} isOpen={status === MergeStatus.Merged} onDismiss={() => {window.location.reload(); setStatus(MergeStatus.None)}} />

      <PrimaryCard width="auto" margin="auto">
        <CardContent>
          <Title>
            Merge
          </Title>

          { account != null ?
              isApproved ? 
                isAllowMerge ? 
                <Container hideInput={false}>
                  <LabelRow>            
                    <RowBetween>
                      <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                        How many nft you want to merge
                        </TYPE.body>
                    </RowBetween>
                  </LabelRow> 
                  <InputRow>
                      <NumericalInput
                      className="token-amount-input"
                      value={value}
                      onUserInput={val => onUserOutput(val)}
                      onSubmit={() => {}}              
                      />
                  </InputRow>

                  {
                    merge.map((merge:NFT, i:any) => 
                    <div key={i}>
                      <LabelRow>            
                        <RowBetween>
                          <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                            NFT {i+1}
                          </TYPE.body>
                        </RowBetween>
                      </LabelRow> 
                      <InputRow>
                        <NFTSelectInput options={myNft} onUserTokenIdSelected={onUserTokenIdSelected} index={i}></NFTSelectInput>
                      </InputRow>
                    </div>
                  )
                  }

                  <ButtonWrapper>
                      <ButtonPrimary disabled={status === MergeStatus.Merging || (value == "" || value == "0" || value == "1" || parseInt(value) > 12) || validateInput()} onClick={() => doMerge()}>
                      {status === MergeStatus.Merging
                          ? <PendingContent text={"Merging..."}/> 
                          : `Merge`}
                      </ButtonPrimary>
                  </ButtonWrapper>
                  {error ? <ErrorMessage error={error} /> : null}
                </Container>
                : <Title>Merging is currently unavailable</Title>
              : 
                <ButtonPrimary disabled={status === MergeStatus.Approving} onClick={() => doApprove()}>
                    {status === MergeStatus.Approving
                        ? <PendingContent text={"Approving..."}/> 
                        : `Approve`}
                </ButtonPrimary>
            : <Title>Please connect your wallet</Title>
          }
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