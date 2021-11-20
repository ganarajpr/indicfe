import Sanscript from '@sanskrit-coders/sanscript';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Fab from '@mui/material/Fab';
import EditIcon from '@mui/icons-material/Edit';
import Verse from '../../../components/HighlightLine';
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import Button from '@mui/material/Button';
import { updateLine } from '../../../fetches/line';
const defaultValues = {
    originalText: "" 
};

const fabStyle = {
    position: 'absolute',
    bottom: 16,
    right: 16,
  };
export default function OriginalText({ line, words }) {
    const [lineState, setLine] = useState({});
    const [editMode, setEditMode] = useState(false);
    const { handleSubmit, reset, register, 
        formState, setValue, getValues } = useForm({ defaultValues });
    
    const getLines = () => {
        return lineState.lines?.map( (line) => {
        return (<Verse line={line} words={lineState.words} key={line}></Verse>)
        });
    };
    useEffect( () => {
        const lines = line.text.split('\n');
        setLine({lines, ...line}); 
        setValue('originalText', Sanscript.t(line.text, 'devanagari', 'itrans')); 
    }, [line]);

    const onOriginalEdit = (e) => {
        const val = e.target.value;
        setValue('originalText', val);
        const text = Sanscript.t(val, 'itrans', 'devanagari');
        const lines = text.split('\n');
        setLine({lines, ...line});
    };

    
  const getEditing = (editMode) => {
        if(!editMode) {
            return;
        }
        
        const onSubmit = async (data) => {
            const line = await updateLine(lineState._id, Sanscript.t(data.originalText, 'itrans', 'devanagari'));
            const lines = line.text.split('\n');
            setLine({lines, ...line}); 
            reset({originalText: Sanscript.t(line.text, 'devanagari', 'itrans')});
            setEditMode(false); 
        };

        return (<Box component="form" 
                noValidate
                onSubmit={handleSubmit(onSubmit)} sx={{
                '& .MuiFormControl-root': { m: 1, p: 0 }
            }}>
            <Box sx={{paddingTop: 1, paddingRight: 1}}>
                <TextField
                    id="originalText"
                    label="Original text"
                    variant="standard"
                    multiline
                    required
                    fullWidth
                    {
                        ...formState.errors.originalText ? {error:true} : null
                    }
                    helperText={formState.errors?.originalText?.message}
                    placeholder="Original text of the verse"
                    rows={8}
                    {...register("originalText", {
                        required: {
                            value: true,
                            message: 'Original text is required'
                        }
                    })
                    }
                    onChange={onOriginalEdit} 
                />
            </Box>
            <Box sx={{paddingTop: 3, paddingLeft: 1}}>
                <Button color='secondary' type="submit" variant="contained" size="large" fullWidth>Submit</Button>
            </Box>
            </Box>);
    };

    return (<Box sx={{ flexGrow: 1, justifyContent: 'center', textAlign: 'center', mt: 5 }}>
        <Paper elevation={1} sx={{ p: 4, overflowWrap: "break-word", position: "relative" }}>
            {getLines()}
            {
                !editMode && (<Fab color="secondary" aria-label="edit" sx={fabStyle} size="small" onClick={() => setEditMode(true)}>
                    <EditIcon />
                </Fab>) 
            }
            {getEditing(editMode)}            
        </Paper>
    </Box>)
}