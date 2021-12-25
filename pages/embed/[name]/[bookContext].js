import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import _ from 'lodash';
import { getLine } from '../../../fetches/line';
import Verse from '../../../components/HighlightLine';
import Typography from '@mui/material/Typography';
import LanguageText from '../../../components/LanguageText';
import Paper from '@mui/material/Paper';
import Head from 'next/head';
import Sanscript from '@sanskrit-coders/sanscript';

export default function ShowLine({ line }) {
    const [lineState, setLine] = useState({});
  useEffect( () => {
    const lines = line.text.split('\n');
    setLine({lines, ...line});  
  }, [line]);

  const getLines = () => {
    return lineState.lines?.map( (line) => {
      return (<Verse line={line} script={lineState.script} words={lineState.words} key={line}></Verse>)
    });
  };

  return (
      <Container maxWidth="lg">
          <Head>
            <title>Smrthi - {Sanscript.t(line.book, 'hk', 'devanagari')} {line.bookContext}</title>
            <link rel="alternate" type="application/json+oembed"
                href={`http://smrthi.com/api/oembed?url=http%3A%2F%2Fsmrthi.com%2Fbook%2F${line.book}%2F${line.bookContext}&format=json`}
                title={`${Sanscript.t(line.book, 'hk', 'devanagari')} ${line.bookContext}`} />
            <meta name="description" content={line.text}/>
            <meta property="og:type" content="website"/>
            <meta property="og:url" content={`https://www.smrthi.com/book/${line.book}/${line.bookContext}`}/>
            <meta property="og:title" content={`Smrithi - ${Sanscript.t(line.book, 'hk', 'devanagari')} ${line.bookContext}`}/>
            <meta property="og:description" content={line.text}/>
            <meta property="og:image" content={`https://www.smrthi.com/api/image/${line.book}/${line.bookContext}.jpg`}/>
            <meta property="twitter:card" content="summary_large_image"/>
            <meta property="twitter:url" content={`https://www.smrthi.com/book/${line.book}/${line.bookContext}`}/>
            <meta property="twitter:title" content={`${Sanscript.t(line.book, 'hk', 'devanagari')} ${line.bookContext}`}/>
            <meta property="twitter:description" content={line.text}/>
            <meta property="twitter:image" content={`https://www.smrthi.com/api/image/${line.book}/${line.bookContext}.jpg`}/>
        </Head>
        <Box sx={{
                flexGrow: 1,
                justifyContent: 'center',
                textAlign: 'center',
                mt: 1
            }}
        >
            <Paper elevation={1} sx={{display: 'block', pb: 1}}>
                <Box sx={{ display: "block", flexGrow: 1, justifyContent: "center" }}>
                    <img src="/logo.png" height="30"/>
                </Box>
                <Box sx={{ display: "flex", flexGrow: 1, justifyContent: "center", 
                    'cursor': 'pointer', ':hover': { color: '#666'}}}>
                    
                    <Typography variant="h5" component="h5" sx={{ color: '#999', ml: 3, pt: 1}}>
                            <LanguageText source="hk">{line.book}</LanguageText>
                            { ' ' + line.bookContext}  
                    </Typography>
                </Box>
            </Paper>
            <Paper elevation={1} sx={{ p: 4, overflowWrap: "break-word", position: "relative" }}>
            {getLines()}     
            </Paper>
        </Box>       
      </Container>      
  )
}



export async function getServerSideProps(context) {
    const { name, bookContext } = context.params;
    const line = await getLine(name, bookContext);
    return {
      props: {
        line
      }
   };
}