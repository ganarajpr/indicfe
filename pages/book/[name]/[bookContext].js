import { useState } from 'react';
import { Container, Grid, Header, Segment } from 'semantic-ui-react';

import { getLine } from '../../../fetches/line';
import Layout from '../../../components/Layout';
import Verse from '../../../components/Verse';
import WordManager from '../../../components/WordManager';

export default function ShowLine({ line }) {
  const [lineState, setLine] = useState({});
  if(!lineState.lines) {
    const lines = line.text.split('\n');
    setLine({lines, ...line});  
  }
  const [selectedWord, setSelectedWord] = useState();
  const [wordInText, setWordInText] = useState('');

  const onSelect = (w, selectedWord) => {
    setSelectedWord(w);
    setWordInText(selectedWord);
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