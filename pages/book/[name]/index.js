import { getBook } from "../../../fetches/books";
import Layout from "../../../components/Layout";
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Link from 'next/link';
import _ from 'lodash-es';
import Head from 'next/head';
import { getSum } from "../../../lib/util";
import Sanscript from '@sanskrit-coders/sanscript';


export default function Book({ bookContexts,bookName }) {

  const getBookContextList = () => {
    if(bookContexts?.length) {
        return _.map(bookContexts, (spl) => {
            return (<Grid item  xs={2}>
                <Link href={`/book/${bookName}/chapter/${spl}`} key={spl}>
                    <Button color='secondary'>{spl}</Button>
                </Link>
            </Grid>);
        });
    }
  };

  return (
    <Layout>
        <Head>
            <title>Smrthi - {bookName}</title>
            <meta name="description" content={ "Chapters of " + Sanscript.t(bookName, 'hk', 'devanagari') }/>
            <meta property="og:type" content="website"/>
            <meta property="og:url" content={`https://www.smrthi.com/book/${bookName}`}/>
            <meta property="og:title" content={`Smrithi - ${Sanscript.t(bookName, 'hk', 'devanagari')} `}/>
            <meta property="og:description" content={ "Chapters of " + Sanscript.t(bookName, 'hk', 'devanagari') }/>
            <meta property="og:image" content={`https://www.smrthi.com/logo.jpg`}/>
            <meta property="twitter:card" content="summary"/>
            <meta property="twitter:url" content={`https://www.smrthi.com/book/${bookName}`}/>
            <meta property="twitter:title" content={`${Sanscript.t(bookName, 'hk', 'devanagari')}`}/>
            <meta property="twitter:description" content={ "Chapters of " + Sanscript.t(bookName, 'hk', 'devanagari') }/>
            <meta property="twitter:image" content={`https://www.smrthi.com/logo.jpg`}/>
        </Head>
        <Container maxWidth="sm">
            <Grid container direction="rows" spacing={2}>
                {getBookContextList()}
            </Grid>
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