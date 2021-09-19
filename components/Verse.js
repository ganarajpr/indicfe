import styled from "styled-components";
import { Popup } from 'semantic-ui-react';
import { getWord } from "../fetches/word";
import { useState } from 'react';

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

const Italicized = styled.span`
    font-style: italic;
`;

const Word = (props) => {
    if(props.children === '|' || props.children === '||') {
        return (<span>{props.children}&nbsp;</span>);    
    }
    const onClick = async () => {
        const wordDoc = await getWord(props.children);
        const translation = wordDoc.translations?.length > 0 ? wordDoc.translations : undefined;
        setTranslation({...translations, [props.children]: translation});
        props.onSelect(wordDoc, props.children);
    };

    const [translations, setTranslation] = useState({});

    const onHover = async (word) => {
        if(!translations[word]) {
            const wordDoc = await getWord(word);
            const translation = wordDoc.translations?.length > 0 ? wordDoc.translations : undefined;
            setTranslation({...translations, [word]: translation});
        }
    };
    return (
        <>
        <Popup
          trigger={<StyledWord onClick={onClick} onMouseOver={() => onHover(props.children)}>{props.children}</StyledWord>}
          content={translations[props.children] ? translations[props.children][0].text:  <Italicized>No Translations; Click to add</Italicized>}
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