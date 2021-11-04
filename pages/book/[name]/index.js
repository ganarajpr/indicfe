import { getBook } from "../../../fetches/books";
import Layout from "../../../components/Layout";
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Link from 'next/link';
import _ from 'lodash-es';
import Head from 'next/head';

export default function Book({ bookContexts,bookName }) {

  const getBookContextList = () => {
    if(bookContexts?.length) {
        const bcSplits = _.groupBy(bookContexts, (bc) => { 
            const sp = bc.split('.'); 
            return _.take(sp, sp.length - 1).join(""); 
        });
        return _.map(_.keys(bcSplits), (spl) => {
            const curContext = bcSplits[spl];
            const current = curContext.map( (spl) => {
                return (
                    <Link href={`/book/${bookName}/${spl}`} key={spl}>
                        <Button>{spl}</Button>
                    </Link>);
            }); 
            return (<Grid item  xs={2}>{current}</Grid>);
        });
    }
  };

  return (
    <Layout>
        <Head>
            <title>Smrithi - {bookName}</title>
        </Head>
        <Container maxWidth="sm">
            <Grid container direction="column" spacing={2}>
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