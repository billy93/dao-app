import React from 'react'
import styled from 'styled-components'
import Web3Status from '../Web3Status'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { YellowCard } from '../Card'
import { RowFixed } from '../Row'
import { NETWORK_LABELS } from '../../constants'
import { supportedChain } from '../../utils'
// import Logo from '../../assets/images/logo.jpg'
import { Airdrop } from '../Airdrop'
import { NavLink } from 'react-router-dom'


const HeaderFrame = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  width: 100%;
  top: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1rem;
  z-index: 2;
  height: 5em;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
  `};
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    width: 100%;
    max-width: 960px;
    padding: 1rem;
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    z-index: 99;
    border-radius: 12px 12px 0 0;
    height: 4em;
    background-color: ${({ theme }) => theme.bg1};
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
   flex-direction: row-reverse;
    align-items: center;
  `};
`

const HeaderRow = styled(RowFixed)`
  width: fit-content;
  ${({ theme }) => theme.mediaWidth.upToMedium`
   width: 100%;
  `};
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)};
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;

  :focus {
    border: 1px solid blue;
  }
  /* :hover {
    background-color: ${({ theme, active }) => (!active ? theme.bg2 : theme.bg4)};
  } */
`

const HideSmall = styled.span`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

const NetworkCard = styled(YellowCard)`
  border-radius: 12px;
  padding: 8px 12px;
  width: auto;
  white-space: nowrap;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0;
    margin-right: 0.5rem;
    width: initial;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
  `};
`

// const TitleText = styled.div`
//   font-size: 1.8em;
//   white-space: nowrap;
//   width:fit-content;
//   font-family: cheee-wowie, sans-serif;
// `

const LogoWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 1em;
  align-items: center;
  padding-right: 2em;
  user-select: none;
`

// const LogoImage = styled.img`
//   width: 64px;

//   ${({ theme }) => theme.mediaWidth.upToExtraSmall`
//     width:48px;
//   `};
// `;


const StyledNavLink = styled(NavLink)`
  ${({ theme }) => theme.flexRowNoWrap}
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: #FF0000;
`
  
 export default function Header() {
    const { account, chainId } = useWeb3React<Web3Provider>() 

    return (
      <HeaderFrame>       
        <HeaderRow>
          <StyledNavLink to={'/'}>
            <LogoWrapper>
                {/* <LogoImage src={Logo} alt="logo" /> */}
              {/* <TitleText>
              ROOT DAO
              </TitleText> */}
            </LogoWrapper>          
          </StyledNavLink>
        </HeaderRow>        
        <HeaderControls>
          <HeaderElement>

          {supportedChain(chainId) && account && <Airdrop/>}
            <HideSmall>
              {supportedChain(chainId) && chainId && NETWORK_LABELS[chainId] && (
                <NetworkCard title={NETWORK_LABELS[chainId]}>{NETWORK_LABELS[chainId]}</NetworkCard>
              )}
            </HideSmall>
            <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
              <Web3Status />
            </AccountElement>
          </HeaderElement>         
        </HeaderControls>
      </HeaderFrame>
    )
  }
