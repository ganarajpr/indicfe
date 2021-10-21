import styled from "styled-components";
import { getWord } from "../fetches/word";
import { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';

const Wrapper = styled.div`
    font-size: 2em;
    font-family: 'Vesper Libre', serif;
    text-align: center;
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
    const handleTranslations = (word, availableTranslations) => {
        if(availableTranslations) {
            const tr = availableTranslations.map( (translation) => {
                const { votes, translation: text, _id } = translation;
                return {
                    text,
                    votes,
                    _id
                }
            });        
            setTranslation({...translations, [word]: tr});    
        }
    };
    const onClick = async () => {
        const wordDoc = await getWord(props.children);
        const availableTranslations = wordDoc.translations?.length > 0 ? wordDoc.translations : undefined;
        handleTranslations(props.children, availableTranslations);
        props.onSelect(wordDoc, props.children);
    };

    const [translations, setTranslation] = useState({});

    const onHover = async (word) => {
        if(!translations[word]) {
            const wordDoc = await getWord(word);
            const translation = wordDoc.translations?.length > 0 ? wordDoc.translations : undefined;
            handleTranslations(props.children, translation);
        }
    };

    const getTranslationForToolTip = () => {
        return translations[props.children] ? translations[props.children][0].text:  
            <Italicized>No Translations; Click to add</Italicized>;
    };
    return (<Tooltip title={getTranslationForToolTip()} arrow placement="top">
            <StyledWord onClick={onClick} 
                onMouseOver={() => onHover(props.children)}>{props.children}&nbsp;
            </StyledWord>
    </Tooltip>);
}

const Verse = (props) => {
    const { line } = props;
    const wordsInLine = line.split(' ');
    return (<>
        <Wrapper>
        {wordsInLine.map((word) => <Word key={word} onSelect={props.onSelect}>{word}</Word>)}
        </Wrapper>
    </>)    
};

export default Verse;