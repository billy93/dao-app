import React, {useState} from 'react'
import styled from 'styled-components'
import { ButtonSecondary } from '../Button'
import InfoModal from '../InfoModal'
import { darken, transparentize } from 'polished'

const SemiTransparentCard = styled(ButtonSecondary)`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  align-items: center;
  padding: 0.5rem;
  border-radius: 12px;
  cursor: pointer;
  user-select: none;
  /* background-color: ${({ theme }) => transparentize(0.7, theme.primary1)}; */
  border: 1px solid ${({ theme }) => darken(0.05, theme.primary1)};
  color: ${({ theme }) => darken(0.05, theme.primary1)};
  font-weight: 500;

  :hover,
  :focus {
    border: 1px solid ${({ theme }) => darken(0.05, theme.primary1)};
    color: ${({ theme }) => theme.primary1};
  }
`
const Text = styled.p`
  flex: 1 1 auto;
  /* overflow: hidden; */
  /* text-overflow: auto; */
  white-space: nowrap;
  padding: 0rem 1rem;
  margin: 0 0.5rem 0 0.25rem;
  font-size: 1rem;
  width: fit-content;
  font-weight: 500;
`
interface SemiTransparentButtonProps {
  text: string,
}

export default function SemiTransparentButton({
  text}: SemiTransparentButtonProps) {
    const [modalOpen, setModalOpen] = useState<boolean>(false)
  const toggleInfoModal = () => { setModalOpen(!modalOpen) }
    return (
      <>
        <SemiTransparentCard width="auto" onClick={toggleInfoModal}>
          <Text>
            {text}
          </Text>
        </SemiTransparentCard>
        <InfoModal
          modalOpen={modalOpen}
          toggleInfoModal={toggleInfoModal}
        />
      </>
    )
}