
import { getLine } from '../../fetches/line';
import Layout from '../../components/Layout';
import { Container, Grid, Segment, Rail, Form } from 'semantic-ui-react';
import Verse from '../../components/Verse';
import TranscriptInput from '../../components/TranscriptInput';
import { useState } from 'react';
import { addWordToLine } from '../../fetches/line';
import { useRouter } from 'next/router';
export default function ShowLine({ line }) {
  const [transcribed, setTranscribed] = useState('');
  // const [submitToAdd, setSubmitToAdd] = useState();
  const [lineState, setLine] = useState({});
  const router = useRouter();
  const { lineId } = router.query;
  if(!lineState.lines) {
    const lines = line.text.split('\n');
    setLine({lines, ...line});  
  }

  const rows = lineState.lines?.map( (line) => {
    return (<Grid.Row centered columns={1} key={line}>
      <Grid.Column>
        <Verse>{line}</Verse>
      </Grid.Column>  
      <Grid.Column>      
      </Grid.Column>
    </Grid.Row>)
  });
  const onInputChange = (val) => {
    setTranscribed(val);
  };

  const getWordsInLine = () =>{ 
    const words = lineState.words;
    if(words?.length) {
      return words.map( (word) => word.text).join(' ');
    }
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
            {rows}     
          </Grid>
          {/* <Rail internal position='right'>
            <Segment>{line.script}</Segment>
          </Rail> */}
        </Segment>
        <Segment>
          {transcribed} {getWordsInLine()}
        </Segment>
        <Segment>
          <Form onSubmit={onSubmit}>
            <Form.Field>
              <TranscriptInput onChange={onInputChange} transcribed={transcribed}/>
            </Form.Field>
          </Form>
        </Segment>
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
      },
   };
}