import React from 'react'
import styled, {
  ThemeProvider as StyledComponentsThemeProvider,
  createGlobalStyle,
  css,
  DefaultTheme
} from 'styled-components'
// import { darken, transparentize } from 'polished'
import { Text, TextProps } from 'rebass'
import { Colors } from './styled'
// import { useWeb3React } from '@web3-react/core'

const MEDIA_WIDTHS = {
  upToExtraSmall: 500,
  upToSmall: 720,
  upToMedium: 960,
  upToLarge: 1280
}

const mediaWidthTemplates: { [width in keyof typeof MEDIA_WIDTHS]: typeof css } = Object.keys(MEDIA_WIDTHS).reduce(
  (accumulator, size) => {
    ;(accumulator as any)[size] = (a: any, b: any, c: any) => css`
      @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
        ${css(a, b, c)}
      }
    `
    return accumulator
  },
  {}
) as any

const white = '#FFFFFF'
const black = '#000000'

export function colors(): Colors {
  return {
    // base
    white,
    black,

    // text
    text1: white,
    text2: white,
    text3: white,
    text4: white,
    text5: white,

    // backgrounds / greys
    bg1: '#4680ff',
    bg2: '#4680ff',
    bg3: '#4680ff',
    bg4: '#4680ff',
    bg5: '#4680ff',

    //specialty colors
    modalBG: 'rgba(0,0,0,.425)',
    advancedBG: 'rgba(0,0,0,0.1)',

    //primary colors
    primary1: '#4680ff',
    primary2: '#4680ff',
    primary3: '#4680ff',
    primary4: '#4680ff',
    primary5: '#4680ff',

    // color text
    primaryText1: '#ffffff',

    // secondary colors
    secondary1: '#2172E5',
    secondary2: '#17000b26',
    secondary3: '#17000b26',

    // other
    red1: '#FF6871',
    red2: '#F82D3A',
    green1: '#27AE60',
    yellow1: '#FFE270',
    yellow2: '#F3841E',
    blue1: '#2172E5'

    // dont wanna forget these blue yet
    // blue4: '#153d6f70',
    // blue5: '#153d6f70'
  }
}

export function colorsBSC(): Colors {
  return {
    // base
    white,
    black,

    // text
    text1: '#FFFFFF',
    text2: '#C3C5CB',
    text3: '#6C7284',
    text4: '#565A69',
    text5: '#2C2F36',

    // backgrounds / greys
    bg1: '#212429',
    bg2: '#2C2F36',
    bg3: '#40444F',
    bg4: '#565A69',
    bg5: '#6C7284',

    //specialty colors
    modalBG: 'rgba(0,0,0,.425)',
    advancedBG: 'rgba(0,0,0,0.1)',

    //primary colors
    primary1: '#f0b90b',
    primary2: '#5ad535',
    primary3: '#57be4a',
    primary4: '#58ad3770',
    primary5: '#196f1570',

    // color text
    primaryText1: '#86c583',

    // secondary colors
    secondary1: '#2172E5',
    secondary2: '#17000b26',
    secondary3: '#17000b26',

    // other
    red1: '#FF6871',
    red2: '#F82D3A',
    green1: '#27AE60',
    yellow1: '#FFE270',
    yellow2: '#F3841E',
    blue1: '#2172E5'

    // dont wanna forget these blue yet
    // blue4: '#153d6f70',
    // blue5: '#153d6f70'
  }
}

// matic
export function theme(): DefaultTheme {
  return {
    ...colors(),

    grids: {
      sm: 8,
      md: 12,
      lg: 24
    },

    //shadows
    shadow1: '#000',

    // media queries
    mediaWidth: mediaWidthTemplates,

    // css snippets
    flexColumnNoWrap: css`
      display: flex;
      flex-flow: column nowrap;
    `,
    flexRowNoWrap: css`
      display: flex;
      flex-flow: row nowrap;
    `
  }
}

export function themeBSC(): DefaultTheme {
  return {
    ...colorsBSC(),

    grids: {
      sm: 8,
      md: 12,
      lg: 24
    },

    //shadows
    shadow1: '#000',

    // media queries
    mediaWidth: mediaWidthTemplates,

    // css snippets
    flexColumnNoWrap: css`
      display: flex;
      flex-flow: column nowrap;
    `,
    flexRowNoWrap: css`
      display: flex;
      flex-flow: row nowrap;
    `
  }
}


export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  // const { chainId } = useWeb3React();
  let themeObject = theme()

  // if(chainId == 137){
  //   themeObject = theme()
  // }
  // else if(chainId == 1){
  //   themeObject = theme()
  // }
  // else if(chainId == 56){
  //   themeObject = themeBSC()
  // }
  return <StyledComponentsThemeProvider theme={themeObject}>{children}</StyledComponentsThemeProvider>
}

const TextWrapper = styled(Text)<{ color: keyof Colors }>`
  color: ${({ color, theme }) => (theme as any)[color]};
`

export const TYPE = {
  main(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text2'} {...props} />
  },
  link(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'primary1'} {...props} />
  },
  black(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text1'} {...props} />
  },
  white(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'white'} {...props} />
  },
  body(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={16} color={'text1'} {...props} />
  },
  largeHeader(props: TextProps) {
    return <TextWrapper fontWeight={600} fontSize={24} {...props} />
  },
  mediumHeader(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={20} {...props} />
  },
  subHeader(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={14} {...props} />
  },
  small(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={11} {...props} />
  },
  blue(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'primary1'} {...props} />
  },
  yellow(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'yellow1'} {...props} />
  },
  darkGray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text3'} {...props} />
  },
  gray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'bg3'} {...props} />
  },
  italic(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={12} fontStyle={'italic'} color={'text2'} {...props} />
  },
  error({ error, ...props }: { error: boolean } & TextProps) {
    return <TextWrapper fontWeight={500} color={error ? 'red1' : 'text2'} {...props} />
  }
}

export const FixedGlobalStyle = createGlobalStyle`
`

export const ThemedGlobalStyle = createGlobalStyle`
`
