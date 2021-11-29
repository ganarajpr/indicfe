import styled from "styled-components";
import Tooltip from '@mui/material/Tooltip';
import _ from 'lodash';
import LanguageText from "./LanguageText";

const Wrapper = styled.div`
    font-size: 2em;
    font-family: 'Vesper Libre', serif;
    text-align: center;
`;

const StyledWord = styled.span`
    &:hover {
        background-color: #ecc3fa;
    }
`;

const Italicized = styled.span`
    font-style: italic;
`;

const Word = (props) => {
    if(props.children === '|' || props.children === '||') {
        return (<span>{props.children}&nbsp;</span>);    
    }

    const {translations, script} = props; 
    console.log('word', script);
    const getTranslationForToolTip = () => {
        return translations?.length ? translations[0]:  
            <Italicized>No available Translations</Italicized>;
    };
    return (<Tooltip title={getTranslationForToolTip()} arrow placement="top">
            <StyledWord><LanguageText source={script}>{props.children}</LanguageText>&nbsp;</StyledWord>
    </Tooltip>);
}

const Verse = (props) => {
    const { line, words, script } = props;
    const wordsInLine = line.split(' ');
    const cleaned = _.filter(wordsInLine, (word) => word !== ' ' && word !== '');
    const wordTranslationMap = _.reduce(words.translations, (acc,n) => {
        if(acc[`${n.text}`] && acc[n.text].length) {
            acc[n.text].push(n.translation);
        } else {
            acc[n.text] = [n.translation];
        }
        return acc;
    }, {});
    return (<>
        <Wrapper>
        {cleaned.map((word) => <Word key={word} script={script} 
            translations={wordTranslationMap[word]}>{word}</Word>)}
        </Wrapper>
    </>)    
};

export default Verse;