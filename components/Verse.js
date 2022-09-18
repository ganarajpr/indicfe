import _ from 'lodash';
import LanguageText from "./LanguageText";


const getWordTranslationMap = (translations) => {
    return _.reduce(translations, (acc,n) => {
        if(acc[`${n.text}`] && acc[n.text].length) {
            acc[n.text].push(n.translation);
        } else {
            acc[n.text] = [n.translation];
        }
        return acc;
    }, {});
};

const Word = (props) => {
    if(props.children === '|' || props.children === '||') {
        return (<span>{props.children}&nbsp;</span>);    
    }

    const {translations, script} = props; 
    const getTranslationForToolTip = () => {
        return translations?.length ? translations[0]:  
            <span className='italic'>No available Translations</span>;
    };
    return (<div className='tooltip' data-tip="click to search">
            <span className="hover:bg-fuchsia-300 cursor-pointer"><LanguageText source={script}>{props.children}</LanguageText>&nbsp;</span>
    </div>);
}

const Verse = (props) => {
    const { line, words, script, small } = props;
    const wordsInLine = line.split(' ');
    const cleaned = _.filter(wordsInLine, (word) => word !== ' ' && word !== '');
    const wordTranslationMap = getWordTranslationMap(words.translations);
    return (<>
        <div className={`${small ? 'text-base' : 'text-4xl'} text-gray-700 text-center p-2`} small={small} data-test="verse">
        {cleaned.map((word) => <Word key={word} script={script} 
            translations={wordTranslationMap[word]}>{word}</Word>)}
        </div>
    </>)    
};

export default Verse;
