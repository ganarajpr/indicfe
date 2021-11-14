import Layout from "../components/Layout";
import { getBooks } from "../fetches/books";
import Container from '@mui/material/Container';
import Link from 'next/link';
import Head from 'next/head';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Sanscript from '@sanskrit-coders/sanscript';
export default function Home({ books } ) {

  const getBookList = () => {
    if(books?.length) {
      return books.map( (book) => {
        return (<Grid item xs={4} key={book}>
            <Card variant="outlined" sx={{ overflowWrap: "break-word" }}>
                <Link href={`/book/${book}`}>
                    <CardActionArea>
                        <CardContent>
                            <Typography color="text.secondary">
                                { Sanscript.t(book, 'hk', 'devanagari') }
                            </Typography>
                            <Typography color="text.secondary">
                                { Sanscript.t(book, 'hk', 'iast') }
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Link>
            </Card>
        </Grid>)
      });      
    }
  };
  {/* <Link href="/add-line">
        <Button color='secondary' variant="contained">Add New Verse</Button>
    </Link> */}
  
  return (
    <Layout>
        <Head>
            <title>Smrthi</title>
        </Head>
        <Container maxWidth="lg">
            <Grid container spacing={2}>
                {getBookList()}

            </Grid>
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