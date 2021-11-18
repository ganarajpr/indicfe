import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useForm } from "react-hook-form";
import _ from 'lodash';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import Sanscript from '@sanskrit-coders/sanscript';

import { getLine, addFullTranslation, deleteTranslationForLine } from '../../../fetches/line';
import Layout from '../../../components/Layout';
import Verse from '../../../components/HighlightLine';
import { useSession } from 'next-auth/client';
import LoggedInContent from '../../../components/LoggedInContent';
import WordTranslations from '../../../components/WordTranslations';
import WordInteractionForm from '../../../components/WordInteractionForm';
import { addWord } from '../../../fetches/word';
import DeleteIcon from '@mui/icons-material/Delete';
import Head from 'next/head';


const defaultValues = {
    translation: ""
  };
export default function ShowLine({ line }) {
    const [lineState, setLine] = useState({});
    const [session] = useSession();

    const { handleSubmit, reset, register, 
        formState: { errors } } = useForm({ defaultValues });

  const isLoggedIn = !!session?.user?.name;

  useEffect( () => {
    const lines = line.text.split('\n');
    setLine({lines, ...line});  
  }, [line]);

  const onSubmit = async (data) => {
      const line = await addFullTranslation(lineState._id, data.translation);
      const lines = line.text.split('\n');
      setLine({lines, ...line}); 
      reset(defaultValues); 
  };

  const onAddTranslation = async (data) => {
    await addWord(data.word, lineState.script, lineState.language, data.translation, lineState.book, lineState.bookContext);
    const line = await getLine(lineState.book, lineState.bookContext);
    const lines = line.text.split('\n');
    setLine({lines, ...line}); 
  };

  const getLines = () => {
    return lineState.lines?.map( (line) => {
      return (<Verse line={line} words={lineState.words} key={line}></Verse>)
    });
  };

  const getWords = () => {
    const wordArray =  lineState.lines?.map( (line) => {
        return line.split(' ');
    });
    return _.flatten(wordArray);
  };

  const onDeleteClick = async (trId) => {
    const updatedLine = await deleteTranslationForLine(line._id, trId);
    const lines = updatedLine.text.split('\n');
    setLine({lines, ...updatedLine});  
  };

  const getTranslations = () => {    
    return lineState.translations?.map( (t, i) => {
      return (
        <Paper elevation={1} sx={{ p: 4, mt: 2, overflowWrap: "break-word" }} key={t.text}>
            <Typography variant="p" component="p" sx={{display: "inline", mr: 4}}>
                    {t.text}        
            </Typography>
            { isLoggedIn && session.user.id === t.createdBy ? 
                <IconButton variant="contained" color="error" onClick={ () => { onDeleteClick(t._id)}}>
                    <DeleteIcon/>
                </IconButton>
                : null 
            }           
        </Paper>);
    });
  };

  return (
    <Layout>
        <Head>
            <title>Smrthi - {line.book} {line.bookContext}</title>
            <link rel="alternate" type="application/json+oembed"
                href={`http://smrthi.com/api/oembed?url=http%3A%2F%2Fsmrthi.com%2Fbook%2F${line.book}%2F${line.bookContext}&format=json`}
                title={`${line.book} ${line.bookContext}`} />
            <meta name="description" content={line.text}/>
            <meta property="og:type" content="website"/>
            <meta property="og:url" content={`https://www.smrthi.com/book/${line.book}/${line.bookContext}`}/>
            <meta property="og:title" content={`Smrithi - ${line.book} ${line.bookContext}`}/>
            <meta property="og:description" content={line.text}/>
            <meta property="og:image" content={`https://www.smrthi.com/api/image/${line.book}/${line.bookContext}`}/>
            <meta property="twitter:card" content="summary_large_image"/>
            <meta property="twitter:url" content={`https://www.smrthi.com/book/${line.book}/${line.bookContext}`}/>
            <meta property="twitter:title" content={`${line.book} ${line.bookContext}`}/>
            <meta property="twitter:description" content={line.text}/>
            <meta property="twitter:image" content={`https://www.smrthi.com/api/image/${line.book}/${line.bookContext}`}/>
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
                <Link href={`/book/${line.book}`}>
                    <Typography variant="h3" component="h3" sx={{'cursor': 'pointer', color: '#999', ':hover': { color: '#666'}}}>
                        { Sanscript.t(line.book, 'hk', 'devanagari') }     
                    </Typography>
                </Link>
                <Typography variant="h4" component="h4" sx={{ color: '#666'}}>
                    {line.bookContext}        
                </Typography>
            </Paper>
        </Box> 
        <Box sx={{
                flexGrow: 1,
                justifyContent: 'center',
                textAlign: 'center',
                mt: 5
            }}
        >
            <Paper elevation={1} sx={{ p: 4, overflowWrap: "break-word" }}>
                {getLines()}
            </Paper>
        </Box>
        <Divider sx={{mb: 3, mt: 3}}/>
        <Typography variant="h5" component="h5" sx={{fontStyle: "italic", mb: 5, color: 'text.secondary'}}>
            Words and Meanings
        </Typography>
        <Paper elevation={1} sx={{ p: 1, mt: 2 }}>
            <WordTranslations words={getWords()} translations={lineState?.words?.translations}/>
            <Divider sx={{mb: 3, mt: 3}}/>
            <WordInteractionForm words={getWords()} 
                translations={lineState?.words?.translations}
                onSubmit={onAddTranslation}/>
        </Paper>
        <Divider sx={{mb: 3, mt: 3}}/>
        <Typography variant="h5" component="h5" sx={{fontStyle: "italic", mb: 5, color: 'text.secondary'}}>
            Full Translations
        </Typography> 
        {getTranslations()}
        <Paper elevation={1} sx={{ p: 1, mt: 2}}>
            <LoggedInContent linkText="Sign in to add full translation">
                <Box component="form" 
                        noValidate
                        onSubmit={handleSubmit(onSubmit)} sx={{
                        '& .MuiFormControl-root': { m: 1, p: 0 }
                    }}>
                    <Box sx={{paddingTop: 1, paddingRight: 1}}>
                        <TextField
                            id="translation"
                            label="Full Translation"
                            variant="standard"
                            multiline
                            required
                            fullWidth
                            {
                                ...errors.translation ? {error:true} : null
                            }
                            helperText={errors?.translation?.message}
                            placeholder="Full Translation of the verse"
                            rows={8}
                            {...register("translation", {
                                required: {
                                    value: true,
                                    message: 'Full translation is required'
                                },
                                minLength: {
                                    value: 50,
                                    message: 'Full Translation should be atleast 100 chars in length'
                                }
                            })
                            } 
                        />
                    </Box>
                    <Box sx={{paddingTop: 3, paddingLeft: 1}}>
                        <Button color='secondary' type="submit" variant="contained" size="large" fullWidth>Add Translation</Button>
                    </Box>
                </Box>
            </LoggedInContent>
        </Paper>         
      </Container>      
    </Layout>    
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