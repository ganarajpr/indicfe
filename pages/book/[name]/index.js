import { getBook } from "../../../fetches/books";
import Layout from "../../../components/Layout";
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import Link from 'next/link';
export default function Book({ bookContexts,bookName }) {

  const getBookContextList = () => {
    if(bookContexts?.length) {
      return bookContexts.map( (bc) => {
        return (<ListItem key={bc}>
                <Link href={`/book/${bookName}/${bc}`}>
                    <Button>{bc}</Button>
                </Link>
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