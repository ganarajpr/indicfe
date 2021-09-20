import { getBook } from "../../fetches/books";
import Layout from "../../components/Layout";
import { Container, Segment, List } from "semantic-ui-react";
export default function Book({ bookContexts,bookName }) {

  const getBookContextList = () => {
    if(bookContexts?.length) {
      return bookContexts.map( (bc) => {
        return (<List.Item key={bc}><a href={`/book/${bookName}/${bc}`}>{bc}</a></List.Item>)
      });      
    }
  };

  return (
    <Layout>
      <Container>
        <Segment>
          <List>
            {getBookContextList()}
          </List>
        </Segment>
      </Container> 
    </Layout>
  )
}



export async function getServerSideProps(context) {
  const { name } = context.params;
  const { bookContexts }  = await getBook(name);
  return {
    props: {
      bookContexts,
      bookName: name
    }
 };
}