import { getBook } from "../../../fetches/books";
import Layout from "../../../components/Layout";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from 'next/link';
import _ from 'lodash-es';
import Head from 'next/head';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Sanscript from '@sanskrit-coders/sanscript';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import LanguageText from "../../../components/LanguageText";

export default function Book({ bookContexts,bookName }) {

  const getBookContextList = () => {
    if(bookContexts?.length) {
        return _.map(bookContexts, (spl) => {
            return (<Grid item xs={12} lg={4} md={3} key={spl} data-test="chapter">
                <Card variant="outlined">
                  <Link href={`/book/${bookName}/chapter/${spl}`}>
                      <CardActionArea>
                          <CardContent>
                              <Typography color="text.secondary">
                                  { spl }
                              </Typography>
                          </CardContent>
                      </CardActionArea>
                  </Link>
                </Card>
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
                  <Box
                    sx={{
                            flexGrow: 1,
                            justifyContent: 'center',
                            textAlign: 'center',
                            mb: 2
                        }}
                    >
                    <Paper elevation={0}>
                        <Box sx={{ display: "flex", flexGrow: 1, pb: 1, justifyContent: "center", 
                            'cursor': 'pointer', ':hover': { color: '#666'}}}>
                            <img src="/smrthi-symbol.png" height="50"/>
                            <Typography variant="h4" component="h4" sx={{ color: '#999', ml: 2, mt: 1}}  data-test="bookName">
                                <LanguageText source="hk">{bookName}</LanguageText>   
                            </Typography>
                        </Box>
                    </Paper>
                </Box>
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
