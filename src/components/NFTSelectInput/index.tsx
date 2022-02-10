import React, {useState} from 'react'
import styled from 'styled-components'
import { NFT } from '../../dtos/NFT';
import { LazyLoadImage } from "react-lazy-load-image-component"
import Card from "../../components/Card"
import { lighten } from 'polished'

// const Main = styled("div")`
//   font-family: sans-serif;
//   background: #f0f0f0;
//   height: 100vh;
// `;

const DropDownContainer = styled("div")`
  width: 100%;
  
`;

const DropDownHeader = styled("div")`
  margin-bottom: 0.8em;
  padding: 0.4em 2em 0.4em 1em;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
  font-weight: 500;
  font-size: 1.3rem;
  color: #3faffa;
`;

const DropDownListContainer = styled("div")``;

const DropDownList = styled("ul")`
  padding: 0;
  margin: 0;
  border: 2px solid #e5e5e5;
  box-sizing: border-box;
  color: #3faffa;
  font-size: 1.3rem;
  font-weight: 500;
  &:first-child {
    padding-top: 0.8em;
  }
`;

const ListItem = styled("li")`
  list-style: none;
  margin-bottom: 0.8em;
`;


const NFTWrapper = styled.div`
    margin: auto;
    display: grid;
    grid-template-columns: 1fr;
    align-items: center;
    padding: 0.15em;
    border-radius: 1em;
    grid-gap: 0.5em;

    background-color: ${({ theme }) => lighten(0.07, theme.bg1)};
    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    grid-template-columns: 1fr;
    `}
`

export const NFTSelectInput = (props:any) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggling = () => setIsOpen(!isOpen);
  const [selectedOption, setSelectedOption] = useState<NFT>(props.options[0]);
  const options: NFT[] = props.options;

  const SmallCard = (props:any) => (
    <Card 
        paddingTop='10px'
        textAlign='center'
        mb={2}
        mx={1}
        borderRadius={18}
        css={{ overflow: 'hidden', position: 'relative' }}
        {...props}
    />
  );
    
  const NFTCard = (props:any) => (
    <SmallCard>
      <LazyLoadImage
        alt={"NFT"}
        effect="blur"
        src={props.image}
        width={200}
        height={200} >
    </LazyLoadImage>
    <br/>
    <p>{props.name} - {props.xmas}</p>
    </SmallCard>
  )

  const onOptionClicked = (value:NFT) => () => {
      setSelectedOption(value);
      setIsOpen(false);
      props.onUserTokenIdSelected(props.index, value.tokenId);
  };

  return (
      <DropDownContainer>
        <DropDownHeader onClick={toggling}>
          {selectedOption.name} - {selectedOption.xmasTrait}
        </DropDownHeader>
        {isOpen && (
          <DropDownListContainer>
            <DropDownList>
            {options.map((option, i) => (
              <ListItem onClick={onOptionClicked(option)} key={i}>
                <NFTWrapper>                  
                  <NFTCard image={option.imageUrl} name={option.name} id={option.tokenId} xmas={option.xmasTrait}>
                  </NFTCard>                  
                </NFTWrapper>
              </ListItem>
            ))}
            </DropDownList>
          </DropDownListContainer>
        )}
      </DropDownContainer>
  )
}

export default NFTSelectInput
