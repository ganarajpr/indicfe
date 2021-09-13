
import { getLine } from '../../fetches/line';
import Layout from '../../components/Layout';
import { Container, Grid, Segment } from 'semantic-ui-react';
export default function ShowLine({ line }) {
  const lines = line.text.split('\n');
  const rows = lines.map( (line) => {
    return (<Grid.Row centered columns={4}>
      <Grid.Column>
        {line}
      </Grid.Column>  
    </Grid.Row>)
  });
  return (
    <Layout>
      <Container>
        <Segment>
          <Grid centered columns={4}>
            {rows}     
          </Grid>
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