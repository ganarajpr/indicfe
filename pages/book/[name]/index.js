import { getBook } from "../../../fetches/books";
import Layout from "../../../components/Layout";
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Link from 'next/link';
import _ from 'lodash-es';
import Head from 'next/head';


const getSum = (c) => {
    return _.sum(
        c.split('.')
            .map((s, i, all) => {
                return i < all.length -1 ? +s*Math.pow(10, 3-i) : +s;
            })
    );
}
export default function Book({ bookContexts,bookName }) {

  const getBookContextList = () => {
    if(bookContexts?.length) {
        const chapters = _.uniq(_.map(bookContexts, (bc) => {
            const sp = bc.split('.'); 
            return _.take(sp, sp.length - 1).join(".");
        }));
        chapters.sort((a, b) => {
            const numa = getSum(a);
            const numb = getSum(b);
            return numa - numb;
        });
        return _.map(chapters, (spl) => {
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