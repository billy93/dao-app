import React, { useState } from 'react'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import WalletConnectIcon from '../../assets/images/walletConnectIcon.svg'
import { injected, walletconnect } from '../../connectors'
import { shortenAddress, supportedChain } from '../../utils'

import Identicon from '../Identicon'

import WalletModal from '../WalletModal'
import styled from 'styled-components'
import { NetworkContextName } from '../../constants'

const IconWrapper = styled.div<{ size?: number }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  & > * {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
` 

// eslint-disable-next-line react/prop-types
function StatusIcon({ connector }: { connector: AbstractConnector }) {
  if (connector === injected) {
    return <Identicon />
  } else if (connector === walletconnect) {
    return (
      <IconWrapper size={16}>
        <img src={WalletConnectIcon} alt={''} />
      </IconWrapper>
    )  
  }
  return null
}

export default function Web3Status() {
  const { active, account, connector, error, chainId } = useWeb3React()
  const contextNetwork = useWeb3React(NetworkContextName)
  
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const toggleWalletModal = () => { setModalOpen(!modalOpen) }
  const suppotedChain = chainId && supportedChain(chainId)
  if (!contextNetwork.active && !active) {
    return null
  }
  if (error || (account && !suppotedChain)) {
    return (
      <>
        <button className="btn-1 d-lg-flex d-none" onClick={toggleWalletModal}>
          {error instanceof UnsupportedChainIdError || !suppotedChain ? 'Wrong Network' : 'Error'}
        </button>
        
        {/* <Web3StatusError onClick={toggleWalletModal}>
          <NetworkIcon />
          <Text>{error instanceof UnsupportedChainIdError || !suppotedChain ? 'Wrong Network' : 'Error'}</Text>
        </Web3StatusError> */}
        <WalletModal walletModalOpen={modalOpen} toggleWalletModal={toggleWalletModal} />
      </>
    )}

  if (account) {
    return (
      <>
        <button className="btn-1 d-lg-flex d-none" onClick={toggleWalletModal}>{shortenAddress(account)}&nbsp;&nbsp; {connector && <StatusIcon connector={connector} />}</button>
        <span className="connect-side d-lg-none d-flex" onClick={toggleWalletModal}>Connected</span>

        {/* <Web3StatusConnected id="web3-status-connected" onClick={toggleWalletModal}>
          <Text>{shortenAddress(account)}</Text>
          {connector && <StatusIcon connector={connector} />}
        </Web3StatusConnected> */}
        <WalletModal walletModalOpen={modalOpen} toggleWalletModal={toggleWalletModal} />
      </>
    )  
  } else {
    return (
      <>
        <button className="btn-1 d-lg-flex d-none" onClick={toggleWalletModal}>Connect Wallet</button>
        <span className="connect-side d-lg-none d-flex" onClick={toggleWalletModal}>Connect <br/> Wallet</span>
        <WalletModal walletModalOpen={modalOpen} toggleWalletModal={toggleWalletModal} />
      </>
    )
  }
}