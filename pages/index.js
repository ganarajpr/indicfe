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
        return (<Grid item xs={12} lg={4} md={3} key={book}>
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
            <title>Smrthi - Home</title>
            <meta name="description" content={ "Books of Ancient Sanskrit/Indic Literature" }/>
            <meta property="og:type" content="website"/>
            <meta property="og:url" content={`https://www.smrthi.com/`}/>
            <meta property="og:title" content={`Smrithi - Home`}/>
            <meta property="og:description" content={ "Books of Ancient Sanskrit/Indic Literature" }/>
            <meta property="og:image" content={`https://www.smrthi.com/logo.jpg`}/>
            <meta property="twitter:card" content="summary"/>
            <meta property="twitter:url" content={`https://www.smrthi.com/`}/>
            <meta property="twitter:title" content={`Smrithi - Home`}/>
            <meta property="twitter:description" content={ "Smrithi - Home"}/>
            <meta property="twitter:image" content={`https://www.smrthi.com/logo.jpg`}/>
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