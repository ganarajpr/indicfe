import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useForm } from "react-hook-form";
import _ from 'lodash';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import Sanscript from '@sanskrit-coders/sanscript';

import { getLine, addFullTranslation, deleteTranslationForLine } from '../../../fetches/line';
import Layout from '../../../components/Layout';
import { useSession } from 'next-auth/client';
import LoggedInContent from '../../../components/LoggedInContent';
import WordTranslations from '../../../components/WordTranslations';
import WordInteractionForm from '../../../components/WordInteractionForm';
import { addWord } from '../../../fetches/word';
import DeleteIcon from '@mui/icons-material/Delete';
import Head from 'next/head';
import OriginalText from './_OriginalText';
import LanguageText from '../../../components/LanguageText';
import ChevronLeftButton from '../../../components/ChevronLeftButton';
import ChevronRightButton from '../../../components/ChevronRightButton';

const defaultValues = {
    translation: ""
  };
const editingForm = {
    originalText: "" 
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
            <Typography variant="p" component="p" sx={{display: "inline", mr: 4}} data-test="translation">
                    {t.text}        
            </Typography>
            { isLoggedIn && session.user.id === t.createdBy ? 
                <IconButton variant="contained" color="error" onClick={ () => { onDeleteClick(t._id)}} data-test="transDelBtn">
                    <DeleteIcon/>
                </IconButton>
                : null 
            }           
        </Paper>);
    });
  };

    const chapter = _.initial(line.bookContext.split('.')).join('.');
    
    return (
      <>
    <Layout>
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
            <meta property="og:image" content={`https://www.smrthi.com/api/image/${line.book}/${line.bookContext}.jpg?1`}/>
            <meta property="twitter:card" content="summary_large_image"/>
            <meta property="twitter:url" content={`https://www.smrthi.com/book/${line.book}/${line.bookContext}`}/>
            <meta property="twitter:title" content={`${Sanscript.t(line.book, 'hk', 'devanagari')} ${line.bookContext}`}/>
            <meta property="twitter:description" content={line.text}/>
            <meta property="twitter:image" content={`https://www.smrthi.com/api/image/${line.book}/${line.bookContext}.jpg`}/>
        </Head>
        <Link href={`/book/${line.book}/chapter/${chapter}`}>
            <div className="grid grid-flow-col justify-center gap-2 cursor-pointer">
                <img className="w-14" src="/smrthi-symbol.png"/>
                <p className="text-4xl inline justify-center self-center text-slate-700" data-test="bookLocation">
                        <LanguageText source="hk">{line.book}</LanguageText>
                        { ' ' + line.bookContext}  
                </p>
            </div>  
        </Link>
        <div className="grid grid-flow-col justify-center mt-4 mb-20 mx-4">
            <OriginalText line={line}/>
          </div>
        
          
        
      {/* <Container maxWidth="lg">
        <Box
            sx={{
                    flexGrow: 1,
                    justifyContent: 'center',
                    textAlign: 'center'
                }}
            >
            <Paper elevation={1} sx={{display: 'flex', pb: 1}}>
                <Link href={`/book/${line.book}/chapter/${chapter}`}>
                    <Box sx={{ display: "flex", flexGrow: 1, justifyContent: "center", 
                        'cursor': 'pointer', ':hover': { color: '#666'}}}>
                        <img src="/smrthi-symbol.png" height="50"/>
                        <Typography variant="h4" component="h4" sx={{ color: '#999', ml: 3}} data-test="bookLocation">
                                <LanguageText source="hk">{line.book}</LanguageText>
                                { ' ' + line.bookContext}  
                        </Typography>
                    </Box>
                </Link>
            </Paper>
        </Box>
        <Divider sx={{mt: 2, mb: 2}}/> 
       
        <OriginalText line={line}/>
        <Box
            sx={{
                    flexGrow: 1,
                    mb: 3, mt: 3
                }}
            >
                { line.prevContext &&
                <Link href={`/book/${line.book}/${line.prevContext}`}>
                    <Typography variant="h5" component="h5" data-test="prevContext"
                        sx={{'cursor': 'pointer', display: 'inline-block', color: 'primary.main', ':hover': { color: 'secondary.main'}, textAlign: 'left'}}>
                        Prev        
                    </Typography>
                </Link>
            }
            {
                line.nextContext && 
                <Link href={`/book/${line.book}/${line.nextContext}`}>
                    <Typography variant="h5" component="h5" data-test="nextContext"
                        sx={{'cursor': 'pointer', display: 'inline-block', color: 'primary.main', ':hover': { color: 'secondary.main'}, float: 'right'}}>
                        Next        
                    </Typography>
                </Link> 
            }
            
        </Box> 
        <Typography variant="h5" component="h5" sx={{fontStyle: "italic", mb: 5, color: 'text.secondary'}} data-test="fullTranslationH5">
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
                        <Button color='secondary' type="submit" variant="contained" data-test="addTranslationButton" size="large" fullWidth>Add Translation</Button>
                    </Box>
                </Box>
            </LoggedInContent>
        </Paper>         
      </Container>       */}
    </Layout>    
            <div className="grid grid-flow-col w-full h-16 border-4 bottom-0 fixed bg-pink-900 text-white">
            { line.prevContext &&
                <Link href={`/book/${line.book}/${line.prevContext}`}>
                        <ChevronLeftButton data-test="prevContext" className="justify-self-start grid grid-flow-col place-items-center text-2xl font-bold ml-5 p-1 hover:bg-white hover:text-pink-900">Previous</ChevronLeftButton>            
                </Link>
                }
                {
                line.nextContext && 
                <Link href={`/book/${line.book}/${line.nextContext}`}>
                            <ChevronRightButton data-test="nextContext" className="justify-self-end grid grid-flow-col place-items-center font-bold text-2xl mr-5 p-1 hover:bg-white hover:text-pink-900">Next</ChevronRightButton>            
                        </Link>
                }
    </div>
    </>
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
