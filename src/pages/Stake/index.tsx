import React, { useEffect, useState } from "react"
import styled from "styled-components"
import Card, { PrimaryCard } from "../../components/Card"
import 'react-lazy-load-image-component/src/effects/blur.css'

import { Box, Text } from 'rebass/styled-components'
import { useWeb3React } from "@web3-react/core"
import { darken, lighten } from 'polished'
import { supportedChain } from "../../utils"
import { NFTTokenService } from "../../services/NFTTokenService"
import { LazyLoadImage } from "react-lazy-load-image-component"
import { NFT } from "../../dtos/NFT"
import { StakingService } from "../../services/StakingService"
import {
  useQuery,
  gql
} from "@apollo/client";
import { ButtonPrimary, PendingContent } from "../../components/Button";
import TransactionCompletedModal from "../../components/TransactionCompletedModal"
import { ErrorMessage } from "../../components/ErrorMessage"

const PageWrapper = styled.div`
    padding-top: 1.5em;
    margin-bottom:100px;

 ${({ theme }) => theme.mediaWidth.upToSmall`
    padding-top:0em;
 `};
`

const NFTWrapper = styled.div`
    margin: auto;
    display: grid;
    grid-template-columns: 1fr;
    align-items: center;
    padding: 0.15em;
    border-radius: 1em;
    grid-gap: 0.5em;

    background-color: ${({ theme }) => lighten(0.07, theme.bg1)};
    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    grid-template-columns: 1fr;
    `}
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
    width: 20em;
    margin:auto;
 ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 100%;
    font-size: 0.75em;
 `};
`

const Name = (props:any) => (
  <Text
    as="h3"
    my={0}
    fontSize={2}
    fontFamily="sans-serif"
    textAlign="center"
    fontWeight="bold"
    {...props}
  />
)

const SmallCard = (props:any) => (
  <Card 
      paddingTop='10px'
      textAlign='center'
      mb={2}
      mx={1}
      borderRadius={18}
      css={{ overflow: 'hidden', position: 'relative' }}
      {...props}
  />
  );
  
const ButtonWrapper = styled.div`
  /* background-color: ${({ theme }) => theme.bg2}; */
  padding: 0.5rem;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  display: flex;
  justify-content: space-between;
  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 1rem`};
`

export const CustomCard = styled(PrimaryCard)<{ width?: string, smallWidth?: string }>`
`

enum StakeStatus {
  None,
  Approving,
  Approved,
  Staking,
  Staked,
  Unstaking,
  Unstaked
}

const USER_DATA = gql`
  query Users($id: String!) {
    users(where:{id:$id}) {
      id
      tokens {
        id
      }
      stake {
        id
      }
    }
  }
`;
export const Stake = () => {
  const { account, library, chainId } = useWeb3React();
  const [myNft, setMynft] = useState<NFT[]>([]); 
  const [nftStaked, setNftStaked] = useState<NFT[]>([]); 
  const [status, setStatus] = useState<StakeStatus>(StakeStatus.None);
  const [isApproved, setIsApproved] = useState<boolean>(); 
  const [completedAction, setCompletedAction] = useState("");
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [error, setError] = useState("");
  const [isAllowStake, setIsAllowStake] = useState<boolean>(); 

  const getAllowStake = async() => {
    const nftTokenService = new NFTTokenService(library, account!, chainId!);
    setIsAllowStake(await nftTokenService.allowStake());
  }

  const getIsApproved = async() => {
    const nftTokenService = new NFTTokenService(library, account!, chainId!);
    const approved = await nftTokenService.isApprovedForAllStake();
    setIsApproved(approved);
  }

  useEffect(() => {
    if(account && supportedChain(chainId)) {
      getIsApproved();
      getAllowStake();
    }
  },  [library, account, chainId]);

  const doApprove = async() => {
    setCompletedAction("Approve complete");
    setStatus(StakeStatus.Approving);
    const nftTokenService = new NFTTokenService(library, account!, chainId!);
    const txResponse = await nftTokenService.setApprovalForAllStake();
    if (txResponse) {
      const receipt = await txResponse.wait()
      if (receipt?.status === 1) {
          setTransactionHash(receipt.transactionHash);
          setStatus(StakeStatus.Approved);
          setIsApproved(true);
      }
      else {
          setError("Transaction Failed");
          setStatus(StakeStatus.None);
      }
    }
    else{
      setStatus(StakeStatus.None);
    }
  }

  const stakeNft = async(id:any) => {
    setError("");
    setCompletedAction("Stake complete");
    setStatus(StakeStatus.Staking);

    try{
      const stakeService = new StakingService(library, account!, chainId!);
      const txResponse = await stakeService.stake(id);
      if (txResponse) {
        const receipt = await txResponse.wait()
        if (receipt?.status === 1) {
            setTransactionHash(receipt.transactionHash);
            setStatus(StakeStatus.Staked);
        }
        else {
            setError("Transaction Failed");
            setStatus(StakeStatus.None);
        }
      }
      else{
        setStatus(StakeStatus.None);
      }
    } catch(e){
      setStatus(StakeStatus.None);
    }
  }

  const unstakeNft = async(id:any) => {
    setError("");
    setCompletedAction("Unstake complete");
    setStatus(StakeStatus.Unstaking);

    try{
      const stakeService = new StakingService(library, account!, chainId!);
      const txResponse = await stakeService.unstake(id);
      if (txResponse) {
        const receipt = await txResponse.wait()
        if (receipt?.status === 1) {
            setTransactionHash(receipt.transactionHash);
            setStatus(StakeStatus.Unstaked);
        }
        else {
            setError("Transaction Failed");
            setStatus(StakeStatus.None);
        }
      }
      else{
        setStatus(StakeStatus.None);
      }
    } catch(e){
      setStatus(StakeStatus.None);
    }
  }
  
  const NFTCard = (props:any) => (
    <SmallCard>
      <LazyLoadImage
        alt={"NFT"}
        effect="blur"
        src={props.image}
        width={250}
        height={250} >
      </LazyLoadImage>
      <br/>      
      <Box py={3} px={3}>
          <Name>{props.name} - {props.xmas}</Name>

          <br/>
  
          { props.stake ? 
          <Option active={status == StakeStatus.None} onClick={() => stakeNft(props.id)}>
              {status == StakeStatus.Staking ? `Staking...` : `Stake`}
          </Option>
          :
          <Option active={status == StakeStatus.None} onClick={() => unstakeNft(props.id)}>
              {status == StakeStatus.Unstaking ? `Unstaking...` : `Unstake`}
          </Option>
          }
        </Box>
    </SmallCard>
  )


  useEffect(() => {
    if(account && supportedChain(chainId)) {
      const getToken = async() => {
        const nftTokenService = new NFTTokenService(library, account!, chainId!);
        const myToken = await nftTokenService.getBingoMyNft(account);
        // console.log(myToken);
        // setMynft([]); 
        setMynft(myToken);
      }
      getToken();
    }
  },  [library, account, chainId]);
  
  let id = account?.toLowerCase();
  const { data } = useQuery(USER_DATA, {
    variables: { id:id },
  }); 

  React.useEffect(() => {
    // do some checking here to ensure data exist
    if (data) {
      const nftTokenService = new NFTTokenService(library, account!, chainId!);
      let stakedNft = data.users[0].stake.map((e:any) => e.id);
      nftTokenService.getNftById(stakedNft).then(function(e){
        setNftStaked(e);
      }, function(err){
        console.log(err);
      });    
    }

    return () => {
      setNftStaked([]);
    };
  }, [data])

  return (
    <PageWrapper>
      <TransactionCompletedModal title={completedAction} hash={transactionHash} isOpen={status === StakeStatus.Staked || status == StakeStatus.Unstaked} onDismiss={() => {window.location.reload(); setStatus(StakeStatus.None)}} />

      <CustomCard width="auto" margin="auto">
        <CardContent>
          <Title>
            Stake
          </Title>

          {
            account != null ?
              isApproved ?
                isAllowStake ? 
                  (myNft.length > 0 || nftStaked.length > 0) ?
                  <div>
                    <NFTWrapper>
                      {                    
                        myNft.map((nft:NFT, i:any) => 
                          <NFTCard key={i} image={nft.imageUrl} name={nft.name} xmas={nft.xmasTrait} id={nft.tokenId} stake={true}>
                          </NFTCard>
                        )
                      }
                      {
                        nftStaked.map((nft:NFT, i:any) => 
                          <NFTCard key={i} image={nft.imageUrl} name={nft.name} xmas={nft.xmasTrait} id={nft.tokenId} stake={false}>
                          </NFTCard>
                        )
                      }
                    </NFTWrapper>
                  </div>
                  : <Title>You don't have any NFT to stake</Title>
                : <Title>Staking is currently unavailable</Title>
              : <ButtonWrapper>                            
                  <ButtonPrimary disabled={status === StakeStatus.Approving} onClick={() => doApprove()}>
                  {status === StakeStatus.Approving
                      ? <PendingContent text={"Approving..."}/> 
                      : `Approve`}
                  </ButtonPrimary>            
              </ButtonWrapper>
          : <Title>Please connect your wallet</Title>
          }        
          {error ? <ErrorMessage error={error} /> : null}
        </CardContent>
      </CustomCard>

      {/* <UpgradeModal
        modalOpen={modalUpgradeOpen}
        toggleInfoModal={toggleUpgradeModal}
        artId={artId}
      /> */}
    </PageWrapper>
  )
}