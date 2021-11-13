import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import _ from 'lodash';
import Box from '@mui/material/Box';
import { useForm } from "react-hook-form";
import NativeSelect from '@mui/material/NativeSelect';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const defaultValues = {
    word: "",
    translation: ""
  };


export default function WordInteractionForm (props) {
    const { words, translations, onSubmit: onFormSubmit } = props;

    const acceptableWords = words?.filter( word => {
        return word !== '|' && word !== '||' &&  !/\s/.test(word) && word !== '';
    });

    const wordTranslationMap = _.reduce( translations, (acc,n) => {
        if(acc[`${n.text}`] && acc[n.text].length) {
            acc[n.text].push(n.translation);
        } else {
            acc[n.text] = [n.translation];
        }
        return acc;
    }, {});

    const { handleSubmit, reset, register, 
        formState: { errors } } = useForm({ defaultValues });

    const onSubmit = async (data) => {
        await onFormSubmit(data);
        reset({translation: ""});
    };

    return ( 
        <Grid>
            <Grid item>
                <Box component="form" 
                        noValidate
                        onSubmit={handleSubmit(onSubmit)} sx={{
                        '& .MuiFormControl-root': { m: 1, p: 0 }
                    }}>
                    <Typography variant="span" component="span">
                        Add translation for &nbsp;      
                    </Typography>
                    <NativeSelect
                        {...register("word", {
                                required: {
                                    value: true,
                                    message: 'Word is required'
                                }
                            })
                        } 
                        variant="standard" 
                        defaultValue={words[0]}
                    >
                        {acceptableWords.map( (wrd) => {
                            return (<option key={wrd} value={wrd}>
                                {wrd}
                            </option>);
                        })}
                    </NativeSelect>
                    <Typography variant="span" component="span">
                        &nbsp; = &nbsp;      
                    </Typography>
                    <TextField sx={{m: 0, ml: 1 }}
                        {...register("translation", {
                            required: {
                                    value: true,
                                    message: 'Translation is required'
                                }
                            })
                        } 
                        variant="standard" 
                    >
                    </TextField >
                    <Button color='secondary' sx={{m: 0, ml: 1}} type="submit" variant="contained">Translate</Button>
                </Box>
            </Grid>
        </Grid>          
    )
  }