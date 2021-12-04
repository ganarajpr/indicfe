import { getBookChapter, getLine } from "../../../../fetches/line";
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
import { getSum } from '../../../../lib/util';
import { Divider } from "@mui/material";
import LanguageText from "../../../../components/LanguageText";

const getLines = (para) => {
    const lines = para.text.split('\n');
    console.log(para);
    return (
        <Card variant="outlined" sx={{ overflowWrap: "break-word" }}>
            <Link href={`/book/${para.book}/${para.bookContext}`}>
                <CardActionArea>
                    <CardContent>
                        {lines.map((line) => {
                            return (<Typography variant="h5" component="div" key={line}>
                                <LanguageText source={para.script}>{line}</LanguageText>
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
    paragraphs.sort((a, b) => {
        const numa = getSum(a.bookContext);
        const numb = getSum(b.bookContext);
        return numa - numb;
    });
    return paragraphs.map( para => {
        return (
            <Box key={para.bookContext} sx={{
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

export default function Book({ lines, bookName, chapter, nextContext, prevContext }) {

    return (
        <Layout>
            <Head>
                <title>Smrthi - {bookName} - {chapter}</title>
            </Head>
            <Container maxWidth="lg">
                <Box
                    sx={{
                            flexGrow: 1,
                            justifyContent: 'center',
                            textAlign: 'center'
                        }}
                    >
                    <Paper elevation={1} sx={{pb: 1}}>
                        <Link href={`/book/${lines[0].book}`}>
                            <Box sx={{ display: "flex", flexGrow: 1, justifyContent: "center", 
                                'cursor': 'pointer', ':hover': { color: '#666'}}}>
                                <img src="/smrthi-symbol.png" height="50"/>
                                <Typography variant="h4" component="h4" sx={{ color: '#999', ml: 2, mt: 1}}>
                                    <LanguageText source="hk">{lines[0].book}</LanguageText>
                                        {' ' + chapter}      
                                </Typography>
                            </Box>
                        </Link>
                    </Paper>
                </Box>
                {displayLines(lines)} 

                <Divider sx={{mt: 2, mb: 2}}/> 
                <Box
                    sx={{
                            flexGrow: 1
                        }}
                    >
                     { prevContext &&
                        <Link href={`/book/${lines[0].book}/chapter/${prevContext}`}>
                            <Typography variant="h5" component="h5" 
                                sx={{'cursor': 'pointer', display: 'inline-block', color: 'primary.main', ':hover': { color: 'secondary.main'}, textAlign: 'left'}}>
                                Prev        
                            </Typography>
                        </Link>
                    }
                    {
                        nextContext && 
                        <Link href={`/book/${lines[0].book}/chapter/${nextContext}`}>
                            <Typography variant="h5" component="h5" 
                                sx={{'cursor': 'pointer', display: 'inline-block', color: 'primary.main', ':hover': { color: 'secondary.main'}, float: 'right'}}>
                                Next        
                            </Typography>
                        </Link> 
                    }
                    
                </Box>                
            </Container> 
        </Layout>
    );
}



export async function getServerSideProps(context) {
  const { name, chpNo } = context.params;
  const { lines, chapter, nextContext, prevContext }    = await getBookChapter(name, chpNo);
  return {
    props: {
      lines,
      chapter,
      bookName: name,
      nextContext,
      prevContext
    }
 };
}