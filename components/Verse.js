import styled from "styled-components";
import { Popup } from 'semantic-ui-react'

const Wrapper = styled.div`
    font-size: 2em;
    font-family: 'Vesper Libre', serif;
`;

const StyledWord = styled.span`
    &:hover {
        background-color: #ecc3fa;
        cursor: pointer;
    }
`;

const Word = (props) => {
    if(props.children === '|' || props.children === '||') {
        return (<span>{props.children}&nbsp;</span>);    
    }
    const onClick = () => {
        props.onSelect(props.children)
    };
    return (
        <>
        <Popup
          trigger={<StyledWord onClick={onClick}>{props.children}</StyledWord>}
          content={props.children}
          position='top left'
          flowing hoverable
        >
        </Popup>
        &nbsp;
        </>
    );
}

const Verse = (props) => {
    const { line } = props;
    const words = line.split(' ');
    return (<Wrapper>
        {words.map((word) => <Word key={word} onSelect={props.onSelect}>{word}</Word>)}
    </Wrapper>)    
};

export default Verse;