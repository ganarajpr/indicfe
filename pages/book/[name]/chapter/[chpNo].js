import { getBookChapter } from "../../../../fetches/line";
import Layout from '../../../../components/Layout';
import Container from '@mui/material/Container';
import Link from 'next/link';
import _ from 'lodash-es';
import Head from 'next/head';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';

const getLines = (para) => {
    const lines = para.text.split('\n');
    return (
        <Card variant="outlined" sx={{ overflowWrap: "break-word" }}>
            <Link href={`/book/${para.book}/${para.bookContext}`}>
                <CardActionArea>
                    <CardContent>
                        {lines.map((line) => {
                            return (<Typography variant="h5" component="div" key={line}>
                                {line}
                            </Typography>);
                        })}
                        <Typography sx={{ mb: 1.5, textAlign: 'right' }} color="text.secondary">
                            { para.bookContext}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Link>
        </Card>
    );
}

const displayLines = (paragraphs) => {
    return paragraphs.map( para => {
        return (
            <Box sx={{
                flexGrow: 1,
                justifyContent: 'center',
                textAlign: 'center',
            }}
        >
            {getLines(para)}
        </Box>
        )
        
    });
};

export default function Book({ lines, bookName, chpNo }) {

    return (
        <Layout>
            <Head>
                <title>Smrithi - {bookName} - {chpNo}</title>
            </Head>
            <Container maxWidth="lg">
                <Box
                    sx={{
                            flexGrow: 1,
                            justifyContent: 'center',
                            textAlign: 'center'
                        }}
                    >
                    <Paper elevation={1}>
                        <Link href={`/book/${lines[0].book}`}>
                            <Typography variant="h3" component="h3" 
                                sx={{'cursor': 'pointer', color: '#999', ':hover': { color: '#666'}}}>
                                {lines[0].book + ' ' + chpNo}        
                            </Typography>
                        </Link>
                    </Paper>
                </Box>
                {displayLines(lines)} 
            </Container> 
        </Layout>
    );
}



export async function getServerSideProps(context) {
  const { name, chpNo } = context.params;
  const lines   = await getBookChapter(name, chpNo);
  return {
    props: {
      lines,
      chpNo,
      bookName: name
    }
 };
}