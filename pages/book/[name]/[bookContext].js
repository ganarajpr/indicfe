import React, { useState, useEffect } from 'react';
import {  Accordion, Icon } from 'semantic-ui-react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useForm } from "react-hook-form";

import { getLine, addFullTranslation, deleteTranslationForLine } from '../../../fetches/line';
import Layout from '../../../components/Layout';
import Verse from '../../../components/Verse';
import WordManager from '../../../components/WordManager';
import { signIn, useSession } from 'next-auth/client';
import LoggedInContent from '../../../components/LoggedInContent';

const defaultValues = {
    translation: ""
  };
export default function ShowLine({ line }) {
    const [lineState, setLine] = useState({});
    const [selectedWord, setSelectedWord] = useState();
    const [wordInText, setWordInText] = useState('');
    const [translation, setTranslation] = useState('');
    const [session] = useSession();

    const { handleSubmit, reset, register, formState: { errors }, 
    getValues } = useForm({ defaultValues, mode: "onBlur" });

  const isLoggedIn = !!session?.user?.name;

  useEffect( () => {
    const lines = line.text.split('\n');
    setLine({lines, ...line});  
  }, [line]);

  const onSelect = (w, selectedWord) => {
    setSelectedWord(w);
    setWordInText(selectedWord);
  };

  const onTranslationChange = (e, {value}) => setTranslation(value);

  const onSubmit = async () => {

      const updatedLine = await addFullTranslation(line._id, translation);
      reset();
    //   setTranslation(''); 
    //   const lines = updatedLine.text.split('\n');
    //   setLine({lines, ...updatedLine});  
  };

  const getLines = () => {
    return lineState.lines?.map( (line) => {
      return (<Verse line={line} onSelect={onSelect}></Verse>)
    });
  };

  const onDeleteClick = async (trId) => {
    const updatedLine = await deleteTranslationForLine(line._id, trId);
    setTranslation(''); 
    const lines = updatedLine.text.split('\n');
    setLine({lines, ...updatedLine});  
  };

  const getTranslations = () => {    
    return lineState.translations?.map( (t, i) => {
      return (
        <Paper elevation={3} sx={{ p: 4, mt: 2, overflowWrap: "break-word" }}>
            <Typography variant="p" component="p" >
                    {t.text}        
            </Typography>
            { isLoggedIn && session.user.id === t.createdBy ? <Icon name='trash alternate outline' onClick={ () => { onDeleteClick(t._id)}}/> : null }           
        </Paper>);
    });
  };

  return (
    <Layout>
      <Container maxWidth="lg" minWidth="sm">
        <Box
            sx={{
                    flexGrow: 1,
                    justifyContent: 'center',
                    textAlign: 'center'
                }}
            >
            <Paper elevation={3}>
                <Typography variant="h3" component="div" >
                    {line.book}        
                </Typography>
                <Typography variant="h4" component="div" >
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
            <Paper elevation={3} sx={{ p: 4, overflowWrap: "break-word" }}>
                {getLines()}
            </Paper>
        </Box>  
        {
          selectedWord ? <Paper elevation={3} sx={{ p: 1, mt: 2 }}>
              <WordManager 
                wordInText={wordInText}
                word={selectedWord} line={lineState}
                ></WordManager></Paper> : null
        }
        {getTranslations()}
        <Paper elevation={3} sx={{ p: 1, mt: 2}}>
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
                                    value: 100,
                                    message: 'Full Translation should be atleast 100 chars in length'
                                }
                            })
                            } 
                        />
                    </Box>
                    <Box sx={{paddingTop: 3, paddingLeft: 1}}>
                        <Button type="submit" variant="contained" size="large" fullWidth>Add Translation</Button>
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