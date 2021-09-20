import Layout from "../components/Layout";
import { Container, List, Segment } from 'semantic-ui-react';
import { getBooks } from "../fetches/books";
export default function Home({ books } ) {

  const getBookList = () => {
    if(books?.length) {
      return books.map( (book) => {
        return (<List.Item key={book}><a href={`/book/${book}`}>{book}</a></List.Item>)
      });      
    }
  };
  
  return (
    <Layout>
      <Container>
        <Segment>
          <List>
            {getBookList()}
          </List>
        </Segment>
        <Segment>
          <List>
            <List.Item key={'addLine'}>
              <a href="/add-line">Add New Verse</a>
            </List.Item>
          </List>
        </Segment>
      </Container> 
    </Layout>
  )
}


export async function getServerSideProps() {
  const { books }  = await getBooks();
  return {
    props: {
      books
    }
 };
}