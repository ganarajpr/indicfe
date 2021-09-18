import styled from "styled-components";
import { Grid, Form } from 'semantic-ui-react'
import { useState } from 'react';

const Wrapper = styled.div`
    font-size: 2em;
    font-family: 'Vesper Libre', serif;
`;

const WordManager = (props) => {
    const { word } = props;
    const [translation, setTranslation] = useState('');

    const handleInputChange = (e, {value}) =>{
        setTranslation(value);
    };
    const onFormSubmit = () => {
        props.onTranslation(word, translation);
        setTranslation('');
    };
    
    return (<Wrapper>
        <Grid columns={2} divided centered>
            <Grid.Row stretched centered>
                <Grid.Column verticalAlign='middle'>
                    {word}
                </Grid.Column>
                <Grid.Column centered>
                    <Form onSubmit={onFormSubmit} centered>
                        <Form.Group widths='equal' verticalAlign='middle'>
                            <Form.Input centered verticalAlign='middle' placeholder='Translate' 
                            action='Translate'
                            value={translation} onChange={handleInputChange}/>
                        </Form.Group>
                    </Form>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    </Wrapper>)    
};

export default WordManager;