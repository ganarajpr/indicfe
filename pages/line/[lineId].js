
import { getLine } from '../../fetches/line';
import Layout from '../../components/Layout';
import { Container, Grid, Segment, Rail, Form } from 'semantic-ui-react';
import Verse from '../../components/Verse';
import TranscriptInput from '../../components/TranscriptInput';
import { useState } from 'react';
import { addWordToLine } from '../../fetches/line';
import { addWord, deleteTranslationForWord } from '../../fetches/word';
import { useRouter } from 'next/router';

import WordManager from '../../components/WordManager';
export default function ShowLine({ line }) {
  const [transcribed, setTranscribed] = useState('');
  const [lineState, setLine] = useState({});
  const router = useRouter();
  const { lineId } = router.query;
  if(!lineState.lines) {
    const lines = line.text.split('\n');
    setLine({lines, ...line});  
  }
  const [selectedWord, setSelectedWord] = useState();

  const onSelect = (w) => {
    setSelectedWord(w);
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

  const onSubmit = async ()=>{
    await addWordToLine(lineId,transcribed);
    const line = await getLine(lineId);    
    const lines = line.text.split('\n');
    setLine({lines, ...line});
    setTranscribed('');
  };

  return (
    <Layout>
      <Container>
        <Segment>
          <Grid centered columns={1}>
            {getLines()}     
          </Grid>
        </Segment>
        {
          selectedWord ? <Segment><WordManager word={selectedWord} script={lineState.script} language={lineState.language}
            ></WordManager></Segment> : null
        }        
      </Container>      
    </Layout>    
  )
}



export async function getServerSideProps(context) {
    const lineId = context.params.lineId;
    const line = await getLine(lineId);
    return {
      props: {
        line
      }
   };
}