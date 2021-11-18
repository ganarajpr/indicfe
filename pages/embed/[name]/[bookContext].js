import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import _ from 'lodash';
import { getLine } from '../../../fetches/line';
import Verse from '../../../components/HighlightLine';
import Link from 'next/link';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

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
                mt: 1
            }}
        >
            <Card variant="outlined" sx={{ overflowWrap: "break-word" }}>
                <Link href={`/book/${line.book}/${line.bookContext}`}>
                    <CardActionArea>
                    <CardHeader
                        title={line.book}
                        subheader={line.bookContext}                        
                    />
                        <CardContent>
                            {getLines()}
                            <Typography sx={{ mb: 1.5, textAlign: 'right', fontStyle: 'italic' }} color="text.secondary">
                                www.smrthi.com
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Link>
            </Card>
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