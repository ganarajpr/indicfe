import { getBook } from "../../../fetches/books";
import Layout from "../../../components/Layout";
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Link from 'next/link';
import _ from 'lodash-es';

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
                return (<ListItem key={spl}>
                    <Link href={`/book/${bookName}/${spl}`}>
                        <Button>{spl}</Button>
                    </Link>
                </ListItem>);
            }); 
            return (<Grid item xs={2}><List>{current}</List></Grid>);
        });
    }
  };

  return (
    <Layout>
      <Container maxWidth="sm">
          <Grid container spacing={2}>
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