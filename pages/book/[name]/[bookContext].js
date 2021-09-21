import React, { useState, useEffect } from 'react';
import { Container, Grid, Header, Segment, Form, Accordion, Icon } from 'semantic-ui-react';

import { getLine, addFullTranslation } from '../../../fetches/line';
import Layout from '../../../components/Layout';
import Verse from '../../../components/Verse';
import WordManager from '../../../components/WordManager';

export default function ShowLine({ line }) {
  const [lineState, setLine] = useState({});

  useEffect( () => {
    const lines = line.text.split('\n');
    setLine({lines, ...line});  
  }, [line]);
  
  const [selectedWord, setSelectedWord] = useState();
  const [wordInText, setWordInText] = useState('');
  const [translation, setTranslation] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const handleAccordionClick = (e, titleProps) => {
    const { index } = titleProps
    const newIndex = activeIndex === index ? -1 : index
    setActiveIndex(newIndex);
  }

  const onSelect = (w, selectedWord) => {
    setSelectedWord(w);
    setWordInText(selectedWord);
  };

  const onTranslationChange = (e, {value}) => setTranslation(value);

  const onSubmit = async () => {
    if(translation) {
      const updatedLine = await addFullTranslation(line._id, translation);
      setTranslation(''); 
      const lines = updatedLine.text.split('\n');
      setLine({lines, ...updatedLine});  
    }
  };

  const getLines = () => {
    return lineState.lines?.map( (line) => {
      return (<Grid.Row centered columns={1} key={line}>
        <Grid.Column>
          <Verse line={line} onSelect={onSelect}></Verse>
        </Grid.Column>  
        <Grid.Column>      
        </Grid.Column>
      </Grid.Row>)
    });
  };

  const getTranslations = () => {
    return lineState.translations?.map( (t, i) => {
      return (<React.Fragment key={t.text}>
        <Accordion.Title
          active={activeIndex === i+1}
          index={i+1}
          onClick={handleAccordionClick}
        >
          <Icon name='dropdown' />
          {t.text.substr(0, 30) + '...'}
        </Accordion.Title>
        <Accordion.Content active={activeIndex === i+1}>
          <p>{t.text}</p>
        </Accordion.Content>
        </React.Fragment>);
    });
  };

  return (
    <Layout>
      <Container>
        <Segment textAlign='center'>
          <Header as='h2'>{line.book}</Header>
          <Header as='h3'>{line.bookContext}</Header>
        </Segment>
        <Segment>
          <Grid centered columns={1}>
            {getLines()}     
          </Grid>
        </Segment>
        {
          selectedWord ? <Segment><WordManager 
            wordInText={wordInText}
            word={selectedWord} script={lineState.script} language={lineState.language}
            ></WordManager></Segment> : null
        }
        <Segment>
        <Accordion fluid styled>
          <Accordion.Title
            active={activeIndex === 0}
            index={0}
            onClick={handleAccordionClick}
          >
            <Icon name='dropdown' />
            Add Verse
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 0}>
            <Form onSubmit={onSubmit}>
              <Form.Field>
                <Form.TextArea label="Full Translation" placeholder="Translation of full paragraph" value={translation} onChange={onTranslationChange}>
                </Form.TextArea>                
              </Form.Field>                 
              <Form.Button>Add Full Translation</Form.Button>
            </Form>
          </Accordion.Content>
          {getTranslations()}
      </Accordion>
            
        </Segment>         
      </Container>      
    </Layout>    
  )
}



export async function getServerSideProps(context) {
    const { name, bookContext } = context.params;
    const line = await getLine(name, bookContext);
    return {
      props: {
        line
      }
   };
}