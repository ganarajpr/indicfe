import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import _ from 'lodash';
import { getLine } from '../../../fetches/line';
import Verse from '../../../components/HighlightLine';
import Link from 'next/link';

export default function ShowLine({ line }) {
    const [lineState, setLine] = useState({});
  useEffect( () => {
    const lines = line.text.split('\n');
    setLine({lines, ...line});  
  }, [line]);

  const getLines = () => {
    return lineState.lines?.map( (line) => {
      return (<Verse line={line} words={lineState.words} key={line}></Verse>)
    });
  };



  return (
      <Container maxWidth="lg">
        <Box sx={{
                flexGrow: 1,
                justifyContent: 'center',
                textAlign: 'center',
                mt: 5
            }}
        >
            <Paper elevation={3} sx={{ p: 4, overflowWrap: "break-word" }}>
                {getLines()}
                <Link href={`/book/${line.book}/${line.bookContext}`} target="_blank">
                    <a>{line.book} {line.bookContext}</a> 
                </Link>
                
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