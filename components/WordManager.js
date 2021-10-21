import styled from "styled-components";
import { Grid, Form, Comment, Header } from 'semantic-ui-react'
import { useState, useEffect } from 'react';
import TranslationManager from "./TranslationManager";
import { deleteTranslationForWord, addWord } from "../fetches/word";
import { useSession, signIn } from 'next-auth/client';
import LoggedInContent from "./LoggedInContent";

const Wrapper = styled.div`
    font-size: 2em;
    font-family: 'Vesper Libre', serif;
`;

const WordManager = (props) => {
    const { line: {script, language, book, bookContext, words}, word } = props;
    const [translation, setTranslation] = useState('');
    const [storedTranslations, setStoredTranslations] = useState([]);
    const [session] = useSession();

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
                return (<TranslationManager key={t.translation} translation={t} onDelete={onDeleteTranslation}/>)
            });
        }
        return null;
    };
    
    useEffect(() => {        
        setStoredTranslations(word.translations);
    }, [wordInText]);

    
    const onAddTranslation = async (word, translation) => {
        const wordWithTranslation = await addWord(word, script, language, translation, book, bookContext);
        setStoredTranslations(wordWithTranslation.translations);
    };

    const onDeleteTranslation = async (translationId) => {
        const word = await deleteTranslationForWord(translationId, book, bookContext);
        setStoredTranslations(word.translations);
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
                <LoggedInContent linkText="Sign in to add translations">
                    <Form onSubmit={onFormSubmit} >
                        <Form.Group widths='equal' >
                            <Form.Input placeholder='Translation in English' 
                            action='Translate'
                            value={translation} onChange={handleInputChange}/>
                        </Form.Group>
                    </Form>
                </LoggedInContent>
            </Grid.Column>
        </Grid.Row>
    </Grid>);    
};

export default WordManager;