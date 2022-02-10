import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { ReactComponent as Close } from '../../assets/images/x.svg'
import Modal from '../Modal'
import { ButtonPrimary } from "../Button";

const loadingFlash = keyframes`
  0% {
      background-position: -250px;
  }
  100% {
      background-position: calc(100% + 250px);
  }
`

const Blurb = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
  margin-bottom: 2rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin: 1rem;
    font-size: 12px;
  `};
`
const CarouselButton = styled(ButtonPrimary)`
  font-weight: 400;
  margin: 0.5rem;
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

const CloseColor = styled(Close)`
  path {
    stroke: ${({ theme }) => theme.text4};
  }
`

const CloseIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 14px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`
const ContentWrapper = styled.div`
  background-color: ${({ theme }) => theme.bg2};
  padding: 2rem;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 1rem`};
`
const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  margin: 0;
  padding: 0;
  width: 100%;
`

const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  padding: 1rem 1rem;
  font-weight: 500;
  color: ${props => (props.color === 'blue' ? ({ theme }) => theme.primary1 : 'inherit')};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};
`

const HoverText = styled.div`
  :hover {
    cursor: pointer;
  }
`
const Skeleton = styled.div`
  width: 100%;
  height: 8rem;
  background-color: rgb(240, 240, 240);
  border-radius: 5px;
  margin-bottom: 1rem;

  &::before {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 5px;
    background: linear-gradient(
      90deg,
      rgb(240, 240, 240) 0px,
      #f9f9f9 calc(50% - 25px),
      #f9f9f9 calc(50% + 25px),
      rgb(240, 240, 240) 100%
    );
    background-size: 35%;
    background-position: 0%;
    background-repeat: no-repeat;
    animation: ${loadingFlash} 1.5s infinite linear;
  }
`
const UpperSection = styled.div`
  position: relative;

  h5 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
  }

  h5:last-child {
    margin-bottom: 0px;
  }

  h4 {
    margin-top: 0;
    font-weight: 500;
  }
`

interface InfoModalProps {
    modalOpen: boolean,
    toggleInfoModal: () => void
}

export default function InfoModal({
    modalOpen,
    toggleInfoModal
} : InfoModalProps) {
    const [selectedCarouselPage, setSelectedCarouselPage] = useState<number>(0)
    const pages = [
        {
            text:`New to upTether? want to go to the moon? worried your simp Ape brain won't get you there? can't seem to peel the layers of these darn confounding alt-coins? worry not, the rootkit team is here to help. follow this short ape's guide to becoming an astro-ape.`,
        },{
            text:`To prepare your pre Cro-Magnon brain for the rigors of space, you'll need to understand the basics. UpTether is a highly deflationary token located on the BSC that leverages the big-brain ERC-31337 standard aptly named the 'Elite protocol'.`,
        },{
            text:`The Elite protocol is a game changer in the cryptocurrencies, with three important mechanisms; the rising price floor, the buyback vault and finally the ability to utilize permanently locked liquidity for buybacks.`,
        },{
            text:`How is this possible? well behind the scenes, we employ rootRobots™ to wrap and unwrap tokens in such a way that we can recycle locked liquidity for buybacks, we also utilize a Transfer Gate which redistribute sellers tax to the vault and staking.`,
        },{
            text:`As the vault fills, funds are strategically used to 'burn' coins in the circulating supply, effectively raising the price floor. In layape's terms this increases the value of all remaining upTether coins.`,
        },{
            text:`Now that you've evolved your brain using a root stone, you are finally ready to take on the elite four and buy some upTether.`,
        },{
            text:`Once you've arrived at your financial destination you can sell here at upTether finance, remember to be mindful of slippage as it dynamically adjusts according to the market, discouraging dumps and promoting a more sustainable ecosystem.`,
        }
    ]
    const togglePage = (direction: string ) => {
        if (direction === "down") {
            console.log('down');
            setSelectedCarouselPage(selectedCarouselPage-1)
        }
        if (direction === "up") {
            console.log('up');
            setSelectedCarouselPage(selectedCarouselPage+1)
        }
    }
function getModalContent() {

    return (
        <UpperSection>
            <CloseIcon onClick={toggleInfoModal}>
                <CloseColor />
            </CloseIcon>
                <HeaderRow color="blue">
                    <HoverText>
                        Back
                    </HoverText>
                </HeaderRow>
            <ContentWrapper>
                        <h2>Ape's Guide to upTether</h2>
                        <Skeleton />
                    <Blurb>
                        <span>{pages[selectedCarouselPage].text}</span>
                    </Blurb>
                    <ButtonWrapper>
                        <CarouselButton
                            disabled={selectedCarouselPage === 0} 
                            onClick={()=>togglePage("down")} 
                            children="previous"
                        />
                        <CarouselButton
                            disabled={selectedCarouselPage === 6} 
                            onClick={()=>togglePage("up")} 
                            children="next"
                        />
                    </ButtonWrapper>
            </ContentWrapper>
        </UpperSection>
    )
    }
    return (
    <Modal isOpen={modalOpen} onDismiss={toggleInfoModal} minHeight={false} maxHeight={90}>
        <Wrapper>{getModalContent()}</Wrapper>
    </Modal>
)
}