
import { getLine } from '../../fetches/line';
import Layout from '../../components/Layout';
import { Container, Grid, Segment, Input } from 'semantic-ui-react';
// import SelectableVerse from '../../components/SelectableVerse';
import Verse from '../../components/Verse';
// plus
export default function ShowLine({ line }) {
  const lines = line.text.split('\n');
  const rows = lines.map( (line) => {
    return (<Grid.Row centered columns={1} key={line}>
      <Grid.Column textAlign="center">
        <Verse>{line}</Verse>
      </Grid.Column>  
      <Grid.Column textAlign="center">      
      </Grid.Column>
    </Grid.Row>)
  });
  return (
    <Layout>
      <Container>
        <Segment>
          <Grid centered columns={1}>
            {rows}     
          </Grid>
        </Segment>
        <Segment>
          <Input
            action={{ icon: 'plus'}}
            labelPosition='right'
            placeholder='Words in line'
          />
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