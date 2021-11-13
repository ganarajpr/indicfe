import Layout from "../components/Layout";
import { getBooks } from "../fetches/books";
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import Link from 'next/link';
import Head from 'next/head';

export default function Home({ books } ) {

  const getBookList = () => {
    if(books?.length) {
      return books.map( (book) => {
        return (<ListItem key={book}>
            <Link href={`/book/${book}`}>
                <Button>{book}</Button>
            </Link>
        </ListItem>)
      });      
    }
  };
  
  return (
    <Layout>
        <Head>
            <title>Smrthi</title>
        </Head>
        <Container maxWidth="sm">
            <List>
                {getBookList()}
                <ListItem key={'addLine'}>
                <Link href="/add-line">
                    <Button color='secondary' variant="contained">Add New Verse</Button>
                </Link>
                </ListItem>
            </List>
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