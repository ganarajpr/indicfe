import styled from "styled-components";
import { Grid, Form, Comment, Header } from 'semantic-ui-react'
import { useState, useEffect } from 'react';
import TranslationManager from "./TranslationManager";
import { deleteTranslationForWord, addWord } from "../fetches/word";

const Wrapper = styled.div`
    font-size: 2em;
    font-family: 'Vesper Libre', serif;
`;

const WordManager = (props) => {
    const { word, line: {script, language, book, bookContext}, wordInText } = props;
    const [translation, setTranslation] = useState('');
    const [storedTranslations, setStoredTranslations] = useState([]);
    const [storedWord, setStoredWord] = useState();

    const handleInputChange = (e, {value}) =>{
        setTranslation(value);
    };
    const onFormSubmit = async () => {
        if(translation) {
            await onAddTranslation(wordInText, translation);
            setTranslation('');
        }        
    };

    const getTranslations = () => {
        if (storedTranslations && storedTranslations.length ) {
            return storedTranslations.map( (t) => {
                return (<TranslationManager key={t.text} word={storedWord} translation={t} onDelete={onDeleteTranslation}/>)
            });
        }
        return null;
    };
    
    useEffect(() => {        
        setStoredTranslations(word.translations);
        setStoredWord(word);
    }, [wordInText]);

    
    const onAddTranslation = async (word, translation) => {
        const wordWithTranslation = await addWord(word, script, language, translation, book, bookContext);
        setStoredTranslations(wordWithTranslation.translations);
        setStoredWord(wordWithTranslation);
    };

    const onDeleteTranslation = async (wordId, translation) => {
        const word = await deleteTranslationForWord(wordId, translation);
        setStoredTranslations(word.translations);
        setStoredWord(word);
    };

    return (<Grid columns={2} divided>
        <Grid.Row stretched>
            <Grid.Column verticalAlign='middle'>
                <Grid columns='equal'>
                    <Grid.Row>
                        <Grid.Column>
                            <Wrapper>
                                {wordInText}
                            </Wrapper>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row stretched>
                        <Grid.Column>
                            <Comment.Group>
                                <Header as='h3' dividing>
                                    Translations 
                                </Header>
                                {getTranslations()}
                            </Comment.Group>
                        </Grid.Column>
                    </Grid.Row>                    
                </Grid>
            </Grid.Column>
            <Grid.Column>
                <Form onSubmit={onFormSubmit} >
                    <Form.Group widths='equal' >
                        <Form.Input placeholder='Translation in English' 
                        action='Translate'
                        value={translation} onChange={handleInputChange}/>
                    </Form.Group>
                </Form>
            </Grid.Column>
        </Grid.Row>
    </Grid>);    
};

export default WordManager;