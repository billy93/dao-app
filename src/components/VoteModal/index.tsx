import { useWeb3React } from "@web3-react/core";
import React, { useState } from 'react'
import styled from 'styled-components'
import Modal from '../Modal'
import { ReactComponent as Close } from '../../assets/images/x.svg'
import { useParams } from "react-router-dom";
import { GovernorService } from "../../services/GovernorService";
import { supportedChain } from "../../utils";

const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  margin: 0;
  padding: 0;
  width: 100%;
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
  background-color: white;
  padding: 2rem;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 1rem`};
`

const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  padding: 1rem 1rem;
  font-weight: 500;
  justify-content:center;
  align-items:center
  background-color:white;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};
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
const CheckStyle = styled.div`
height:21px;
`
const styleWrapper = {
  height: '35px',
  border: '1px solid #cccccc6b',
  borderRadius: '5px',
  margin: '0.5rem'
}
interface VoteModalProps {
  modalOpen: boolean,
  toggleVoteModal: () => void
}

export default function VoteModal({
  modalOpen,
  toggleVoteModal
}: VoteModalProps) {
  const { account, library, chainId } = useWeb3React();
  const [check, setCheck] = useState({
    id: undefined,
    checked: false
  })
  const postVoteParams = async (params: any) => {
    if (account && supportedChain(chainId)) {
      const governorService = new GovernorService(library, account!, chainId!);
      await governorService.postvoteWithReason(params);
    }
  }
  const postVoteParamsWithoutReason = async (params: any) => {
    if (account && supportedChain(chainId)) {
      const governorService = new GovernorService(library, account!, chainId!);
      await governorService.postvoteWithoutReason(params);
    }
  }
  const [comment, setComment] = useState("")
  const proposalId = useParams()
  function handleParams(id: any) {
    setCheck({
      ...check,
      id,
      checked: true
    })
  }
  function handleComment(e: any) {
    setComment(e.target.value)
  }
  function handleSubmit(e: any) {
    e.preventDefault();

    if (comment !== "") {
      let params = {
        proposalId: proposalId,
        support: check?.id === "against" ? 0 : check.id === "for" ? 1 : 2,
        reason: comment,
      }
      postVoteParams(params)
    } else {
      let params = {
        proposalId: proposalId,
        support: check?.id === "against" ? 0 : check.id === "for" ? 1 : 2,
      }
      postVoteParamsWithoutReason(params)
    }
  }
  function getModalContent() {

    return (
      <UpperSection>
        <CloseIcon onClick={toggleVoteModal}>
          <CloseColor />
        </CloseIcon>
        <HeaderRow >
          <h4>Voting</h4>
        </HeaderRow>
        <ContentWrapper>
          <p>Choose your vote</p>
          <div className="form-check d-flex justify-content-between align-items-center px-1" style={styleWrapper}>
            <label className="form-check-label">
              For
            </label>
            <CheckStyle><input type="checkbox" className="form-check-input" value="0" id="for" onChange={() => handleParams('for')} name="for" checked={check && check.id === "for" ? true : false} /></CheckStyle>
          </div>
          <div className="form-check d-flex justify-content-between align-items-center px-1" style={styleWrapper}>
            <label className="form-check-label">
              Against
            </label>
            <CheckStyle>
              <input type="checkbox" className="form-check-input" value="1" name="against" id="against" onChange={() => handleParams('against')} checked={check && check.id === "against" ? true : false} />
            </CheckStyle>
          </div>
          <div className="form-check d-flex justify-content-between align-items-center px-1" style={styleWrapper}>
            <label className="form-check-label">
              Abstain
            </label>
            <CheckStyle><input type="checkbox" className="form-check-input" value="2" id="abstain" onChange={(id) => handleParams('abstain')} name="abstain" checked={check && check.id === "abstain" ? true : false} /></CheckStyle>
          </div>
          <div className="form-group mt-1">
            <label htmlFor="exampleFormControlTextarea1">Add comment</label>
            <textarea className="form-control" id="exampleFormControlTextarea1" rows={2} onChange={handleComment}></textarea>
          </div>
          <button type="submit" className='btn btn-primary' onClick={handleSubmit}>Send</button>
        </ContentWrapper>
      </UpperSection>
    )
  }
  return (
    <Modal isOpen={modalOpen} onDismiss={toggleVoteModal} minHeight={false} maxHeight={90}>
      <Wrapper>{getModalContent()}</Wrapper>
    </Modal>
  )
}