import React from 'react'
import styled from 'styled-components'
import { Button as RebassButton, ButtonProps } from 'rebass/styled-components'
import { darken, lighten } from 'polished'
import { AutoRow } from '../Row'
import Loader from '../Loader'

const Base = styled(RebassButton) <{
  padding?: string
  width?: string
  borderRadius?: string
  altDisabledStyle?: boolean
}>`
  padding: ${({ padding }) => (padding ? padding : '1em')};
  width: ${({ width }) => (width ? width : '100%')};
  font-family:Arial;
  font-weight: 500;
  font-size: 1em;
  text-align: center;
  text-transform: uppercase;
  word-spacing: 0.25em;
  letter-spacing: 0.05em;
  border-radius: 0.75em;
  border-radius: ${({ borderRadius }) => borderRadius && borderRadius};
  outline: none;
  border: 1px solid transparent;
  color: white;
  text-decoration: none;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 1;
  &:disabled {
    cursor: auto;
  }

  > * {
    user-select: none;
  }
`

// A button that triggers some onClick result, but looks like a link.
export const LinkStyledButton = styled.button<{ disabled?: boolean }>`
  border: none;
  text-decoration: none;
  background: none;

  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  color: ${({ theme, disabled }) => (disabled ? theme.text2 : theme.primary1)};
  font-weight: 500;

  :hover {
    text-decoration: ${({ disabled }) => (disabled ? null : 'underline')};
  }

  :focus {
    outline: none;
    text-decoration: ${({ disabled }) => (disabled ? null : 'underline')};
  }

  :active {
    text-decoration: none;
  }
`

export const ButtonPrimary = styled(Base)`
  background-color: ${({ theme }) => theme.primary1};
  color: ${({ theme }) => theme.text1};
  &:hover {
    background-color: ${({ theme }) => darken(0.1, theme.primary1)};
  }
  &:disabled {
    background-color: ${({ theme, altDisabledStyle }) => (altDisabledStyle ? theme.primary1 : theme.bg3)};
    color: ${({ theme, altDisabledStyle }) => (altDisabledStyle ? 'white' : theme.text3)};
    cursor: auto;
    box-shadow: none;
    border: 1px solid transparent;
    outline: none;
    opacity: ${({ altDisabledStyle }) => (altDisabledStyle ? '0.7' : '1')};
  }
`

export const ButtonPrimaryGreen = styled(ButtonPrimary)`
  background-color: ${({ theme }) => theme.green1};

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.green1)};
    background-color: ${({ theme }) => darken(0.05, theme.green1)};
  }

  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.green1)};
  }

  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.green1)};
    background-color: ${({ theme }) => darken(0.1, theme.green1)};
  }

  &:disabled {
    background-color: ${({ theme, altDisabledStyle }) => (altDisabledStyle ? theme.green1 : theme.bg3)};
  }`

export const ButtonPrimaryRed = styled(ButtonPrimary)`
  background-color: ${({ theme }) => darken(0.05, theme.red1)};

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.red1)};
    background-color: ${({ theme }) => darken(0.1, theme.red1)};
  }

  &:hover {
    background-color: ${({ theme }) => darken(0.1, theme.red1)};
  }

  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.15, theme.red1)};
    background-color: ${({ theme }) => darken(0.15, theme.red1)};
  }

  &:disabled {
    background-color: ${({ theme, altDisabledStyle }) => (altDisabledStyle ? darken(0.05, theme.red1) : theme.bg3)};
  }
`

export const ButtonSecondary = styled(Base)`
  border: 1px solid ${({ theme }) => theme.primary4};
  color: ${({ theme }) => theme.primary1};
  background-color: transparent;
  font-size: 16px;
  border-radius: 12px;
  padding: ${({ padding }) => (padding ? padding : '10px')};

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.primary4};
    border: 1px solid ${({ theme }) => theme.primary3};
  }
  &:hover {
    border: 1px solid ${({ theme }) => theme.primary3};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.primary4};
    border: 1px solid ${({ theme }) => theme.primary3};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
  a:hover {
    text-decoration: none;
  }
`

export const Option = styled.button<{ active: boolean }>`
  align-items: center;
  font-size:1em;
  font-weight: ${({ active, theme }) => (active ? '600' : '500')};
  padding: 0.75em 0.75em 0.8em 0.75em;
  border-radius: 1em; 
  border: 0px;
  outline: none;
  cursor: pointer;
  background-color: ${({ active, theme }) => (active ? theme.primary1 :  lighten(0.07, theme.bg1))};
  color: ${({ active, theme }) => (active ? theme.text1 : theme.text2)};
  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }`

const ButtonConfirmedStyle = styled(Base)`
  background-color: ${({ theme }) => lighten(0.5, theme.primary1)};
  color: ${({ theme }) => theme.primary1};
  border: 1px solid ${({ theme }) => theme.primary1};

  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

export function ButtonConfirmed({
  confirmed,
  altDisabledStyle,
  ...rest
} : { confirmed?: boolean; altDisabledStyle?: boolean } & ButtonProps) {
  if (confirmed) {
    return <ButtonConfirmedStyle {...rest} />
  } else {
    return <ButtonPrimary {...rest} altDisabledStyle={altDisabledStyle} />
  }
}

export const PendingContent = ({text} : {text:string}) =>{

  return(
    <AutoRow gap="0.5em" justify="center">
       {text}
      <Loader stroke="white" />
    </AutoRow>
  )
}