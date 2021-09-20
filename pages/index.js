import Layout from "../components/Layout";
import { Container, List, Segment } from 'semantic-ui-react';
export default function Home() {
  return (
    <Layout>
      <Container>
        <Segment>
          <List>
            <List.Item>
              <a href="/add-line">Add Line</a>
            </List.Item>
            <List.Item>
              <a href="/line/6149011f11305edbe0d2cdfa">Show Line</a>
            </List.Item>
          </List>
        </Segment>
      </Container> 
    </Layout>
  )
}


export async function getServerSideProps() {
  return {
    props: {
    }
 };
}