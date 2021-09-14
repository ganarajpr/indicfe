
import { getLine } from '../../fetches/line';
import Layout from '../../components/Layout';
import { Container, Grid, Segment, Rail, Form } from 'semantic-ui-react';
import Verse from '../../components/Verse';
import TranscriptInput from '../../components/TranscriptInput';
import { useState } from 'react';
export default function ShowLine({ line }) {
  const lines = line.text.split('\n');
  const rows = lines.map( (line) => {
    return (<Grid.Row centered columns={1} key={line}>
      <Grid.Column>
        <Verse>{line}</Verse>
      </Grid.Column>  
      <Grid.Column>      
      </Grid.Column>
    </Grid.Row>)
  });
  const [transcribed, setTranscribed] = useState('');
  const onInputChange = (val) => {
    setTranscribed(val);
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
          {transcribed}
        </Segment>
        <Segment>
          <TranscriptInput onChange={onInputChange}/>
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