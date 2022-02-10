import React from 'react';
import styled from 'styled-components'
import { padNumber } from '../../utils/format';

const CountdownGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1.75em 0.5em) 1.75em;
    font-size: 3em;
    align-items:center;
    justify-items:center;
    justify-self:center;
`
const Subtitle = styled.div`
    padding: 0.25em;
    font-size: 0.875rem;
    text-align: center
`

const CountdownWrapper = styled.div`
    justify-self:center;
    color: ${({ theme }) => theme.primary1};
`

const CompleteText = styled.div`
    font-size: 3em;
    text-transform:uppercase;
`

export const CountdownRenderer = ({ days, hours, minutes, seconds, completed }: { days: number, hours: number, minutes: number, seconds: number, completed: boolean }) => {
    if (completed) {
        // Render a complete state
        return (
            <CountdownWrapper>
                <CompleteText>Complete</CompleteText>
            </CountdownWrapper>
        )
    } else {
        // Render a countdown
        return (
            <CountdownWrapper>
                <CountdownGrid>
                    <div>{padNumber(days)}</div>
                    <div>:</div>
                    <div>{padNumber(hours)}</div>
                    <div>:</div>
                    <div>{padNumber(minutes)}</div>
                    <div>:</div>
                    <div>{padNumber(seconds)}</div>
                </CountdownGrid>
                <CountdownGrid>
                    <Subtitle>days</Subtitle>
                    <div></div>
                    <Subtitle>hours</Subtitle>
                    <div></div>
                    <Subtitle>minutes</Subtitle>
                    <div></div>
                    <Subtitle>seconds</Subtitle>
                </CountdownGrid>
            </CountdownWrapper>
        );
    }
};