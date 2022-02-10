import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components'
import { encrypt } from '../../utils/encrypt';
import Copy from '../AccountDetails/Copy';
import { ExternalLink } from '../Link';

const Wrapper = styled.div`
    display: grid;
   
    grid-gap: 1em;
`

const ReferralLinkGrid = styled.div`
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 1fr 9em;
    align-items:center;
    grid-gap: 0.5em;
    padding: 1em;
    font-size: 0.75rem;
    border-radius: 1em;
`

const ReferralLinkWrapper = styled(ExternalLink)`
    overflow-wrap: anywhere;
    word-break: break-word;
`

const Description = styled.div`
  padding-top: 1.5em;
  font-size: 0.875rem;
  line-height: 1.25em;
  text-align:center;
  color: ${({ theme }) => theme.primary1};
`


export const ReferralLink = ({ address }: { address: string }) => {
    let { ref } = useParams<{ ref: string }>();
    const currentUrl = ref ? window.location.href.replace(ref, "") : window.location.href;

    let referralLink = currentUrl + encrypt(address);
    if(!currentUrl.endsWith("/")){
        referralLink = currentUrl + "/" + encrypt(address);
    }

    return (
        <Wrapper>
        <Description>
                Share your referral link to reveal your NFTs christmas trait
        </Description>
        <ReferralLinkGrid>            
            <ReferralLinkWrapper href={referralLink}>{referralLink}</ReferralLinkWrapper>
            <Copy toCopy={referralLink}>
                <span style={{ marginLeft: '4px' }}>Copy Link</span>
            </Copy>
        </ReferralLinkGrid>
        </Wrapper>
    )
}