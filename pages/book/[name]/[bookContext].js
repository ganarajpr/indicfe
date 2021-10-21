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

import { getLine, addFullTranslation, deleteTranslationForLine } from '../../../fetches/line';
import Layout from '../../../components/Layout';
import Verse from '../../../components/HighlightLine';
import { useSession } from 'next-auth/client';
import LoggedInContent from '../../../components/LoggedInContent';
import WordTranslations from '../../../components/WordTranslations';
import WordInteractionForm from '../../../components/WordInteractionForm';
import { addWord } from '../../../fetches/word';
import DeleteIcon from '@mui/icons-material/Delete';

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
      reset(); 
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
        <Paper elevation={3} sx={{ p: 4, mt: 2, overflowWrap: "break-word" }} key={t.text}>
            <Typography variant="p" component="p" sx={{display: "inline", mr: 4}}>
                    {t.text}        
            </Typography>
            { isLoggedIn && session.user.id === t.createdBy ? 
                <Button variant="contained" color="error" onClick={ () => { onDeleteClick(t._id)}}>
                    <DeleteIcon/>
                </Button>
                : null 
            }           
        </Paper>);
    });
  };

  return (
    <Layout>
      <Container maxWidth="lg">
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
        <Divider sx={{mb: 3, mt: 3}}/>
        <Typography variant="h5" component="h5" sx={{fontStyle: "italic", mb: 5, color: 'text.secondary'}}>
            Words and Meanings
        </Typography>
        <Paper elevation={3} sx={{ p: 1, mt: 2 }}>
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
                                    value: 50,
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