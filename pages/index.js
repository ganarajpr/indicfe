// import Head from 'next/head'
// import Image from 'next/image'
import Layout from "../components/Layout";
import { Container, Grid, List, Segment } from 'semantic-ui-react';
export default function Home() {
  return (
    <Layout>
      <Container>
        <Segment>
          <List>
            <List.Item>
              <a href="/add-word">Add Word</a>
            </List.Item>
            <List.Item>
              <a href="/add-line">Add Line</a>
            </List.Item>
            <List.Item>
              <a href="/line/613fb4e9c1a8e095654e5398">Show Line</a>
            </List.Item>
            <List.Item>
              <a href="/add-translation">Add Translation of Word</a>
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