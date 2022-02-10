import React, {useState} from 'react';
import styled from 'styled-components';
import { ButtonPrimary } from "../Button/index";
import Loader from '../Loader'

const StyledLoader = styled(Loader)`
  margin-right: 1rem;
`
const InfoCard = styled.div`
  h6 {
    margin-bottom: 1rem;
  }
  div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
    margin-top: 1rem;
    border: grey;
    border-width: 1px;
    border-style: solid;
    padding-left: 1rem;
    padding-right: 1rem;
    border-radius: 0.5rem;
  }
`
declare const window: any

export default function NetworkInfoCard() {
    const [loading, setLoading] = useState<boolean>(false)

    // const Matic =
    //   [{
    //     chainId: '0x89',
    //     chainName: 'Matic Mainnet',
    //     nativeCurrency: {
    //       name: 'MATIC',
    //       symbol: 'MATIC',
    //       decimals: 18
    //     },
    //     rpcUrls: ['https://rpc-mainnet.maticvigil.com/'],
    //     blockExplorerUrls: ['https://explorer.matic.network/']
    //   }]

    // const BSC =
    //   [{
    //     chainId: '0x38',
    //     chainName: 'Smart Chain',
    //     nativeCurrency: {
    //       name: 'BNB',
    //       symbol: 'BNB',
    //       decimals: 18
    //     },
    //     rpcUrls: ['https://bsc-dataseed.binance.org/'],
    //     blockExplorerUrls: ['https://bscscan.com']
    //   }]

    const ETH = 
      [{
        chainId: '0x01',
        chainName: 'Ethereum',
        nativeCurrency: {
          name: 'ETH',
          symbol: 'ETH',
          decimals: 18
        },
        rpcUrls: ['https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
        blockExplorerUrls: ['https://etherscan.io']
      }];


    const addNetwork = (params: any) =>{
        setLoading(true)
        window.ethereum.request({ method: 'wallet_addEthereumChain', params })
          .then(() => {
            setLoading(false)
          })
          .catch((error: Error) => console.log( `Error: ${error.message}`))
    }
    return (
        <InfoCard>
            {/* <ButtonPrimary onClick={() => addNetwork(Matic)} >
                {loading
                    ? <><StyledLoader />Switching Networks...</>
                    : 'Add Matic Mainnet'
                }
            </ButtonPrimary>
            <br/> */}
            {/* <ButtonPrimary onClick={() => addNetwork(BSC)} >
                {loading
                    ? <><StyledLoader />Switching Networks...</>
                    : 'Add Binance Smart Chain Mainnet'
                }
            </ButtonPrimary>
            <br/> */}
            <ButtonPrimary onClick={() => addNetwork(ETH)} >
                {loading
                    ? <><StyledLoader />Switching Networks...</>
                    : 'Add Ethereum Mainnet'
                }
            </ButtonPrimary>
        </InfoCard>
    )
}
