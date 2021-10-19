import { getBook } from "../../../fetches/books";
import Layout from "../../../components/Layout";
import { Segment } from "semantic-ui-react";
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';

export default function Book({ bookContexts,bookName }) {

  const getBookContextList = () => {
    if(bookContexts?.length) {
      return bookContexts.map( (bc) => {
        return (<ListItem key={bc}>
            <Button href={`/book/${bookName}/${bc}`}>{bc}</Button>
        </ListItem>);
      });      
    }
  };

  return (
    <Layout>
      <Container maxWidth="sm">
          <List>
            {getBookContextList()}
          </List>
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