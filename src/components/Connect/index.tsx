import React from 'react';
import styled from 'styled-components'
import { SemiTransparentCard } from '../Card'

const Text = styled.div`
  text-align: center;
`


export const Connect = () => {
    return (
        <SemiTransparentCard width="auto">
            <Text>
                Connect to a wallet to use see your referral link
            </Text>            
        </SemiTransparentCard>
    )
} 