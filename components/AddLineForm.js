import { useEffect } from "react";
import { Select, MenuItem } from "@material-ui/core";
import { useForm, Controller } from "react-hook-form";
import Box from '@mui/material/Box';
import { Typography } from "@mui/material";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const defaultValues = {
  script: "devanagari",
  language: "sanskrit",
  line: "",
  book: "",
  bookContext: ""
};

const scriptOptions = [
    { key: 'devanagari', text: 'Devanagari', value: 'devanagari' },
    { key: 'roman', text: 'Roman', value: 'roman' },
    { key: 'kannada', text: 'Kannada', value: 'kannada' }
  ];

  const languageOptions = [
    { key: 'sanskrit', text: 'Sanskrit', value: 'sanskrit' },
    { key: 'english', text: 'English', value: 'english' },
    { key: 'kannada', text: 'Kannada', value: 'kannada' }
];

export default function AddLineForm(props) {
  const { handleSubmit, reset, control, register, formState: { errors }, 
    getValues } = useForm({ defaultValues, mode: "onBlur" });
  const onSubmit = async (data) => {
      await props.onSubmit(data);
      reset(defaultValues);
  };

  return (
    <Box component="form" 
        noValidate
        onSubmit={handleSubmit(onSubmit)} sx={{
        '& .MuiFormControl-root': { m: 1, p: 0 }
      }}>
        <Typography variant="h6" component="span" >
            Text containing &nbsp;        
        </Typography>
        <Controller
            render={
            ({ field }) => <Select {...field} variant="standard" required>
                {languageOptions.map( (scr) => {
                    return (<MenuItem key={scr.key} value={scr.value}>
                        {scr.text}
                    </MenuItem>);
                })}
            </Select>
            }
            control={control}
            name="language"
        />
        <Typography variant="h6" component="span" >
            &nbsp;in script &nbsp;        
        </Typography>
        <Controller
            render={
            ({ field }) => <Select {...field} variant="standard">
                {scriptOptions.map( (scr) => {
                    return (<MenuItem key={scr.key} value={scr.value}>
                        {scr.text}
                    </MenuItem>);
                })}
            </Select>
            }
            control={control}
            name="script"
        />
        <Box sx={{paddingTop: 1}}>
            <TextField
                id="line-paragraph"
                label="Paragraph or Shloka or Mantra"
                variant="standard"
                multiline
                required
                fullWidth
                {
                    ...errors.line ? {error:true} : null
                }
                helperText={errors?.line?.message}
                placeholder="1 Paragraph or Shloka or Mantra or Verse"
                rows={8}
                {...register("line", {
                    required: {
                        value: true,
                        message: 'Paragraph is required'
                    },
                    minLength: {
                        value: 20,
                        message: 'Paragraph should be atleast 20 length'
                    },
                    validate: {
                        isDevanagari: (v) => {
                            const lang = getValues('language');
                            if(lang === 'sanskrit') {
                                return /^[\u0900-\u097f\s\W\d]+$/.test(v) 
                                    || 'Paragraph should be in devanagari';
                            }
                            return true;
                        }
                    }
                  })
                } 
            />
        </Box>
        <Box sx={{paddingTop: 1}}>
            <TextField
                id="line-book"
                label="Book"
                placeholder="ex: RigVeda"
                variant="standard"
                fullWidth
                required
                {
                    ...errors.book ? {error:true} : null
                }
                helperText={errors?.book?.message}
                size="large"
                {...register("book", {
                    required: {
                        value: true,
                        message: 'Book is required'
                    },
                    minLength: {
                        value: 4,
                        message: 'Book should be atleast 4 length'
                    }
                  })
                } 
            />
        </Box>
        <Box sx={{paddingTop: 1}}>
            <TextField
                id="line-bookContext"
                label="BookContext"
                variant="standard"
                placeholder="ex: 10.5.3 for chapter 10 hymn 5 verse 3"
                fullWidth
                required
                {
                    ...errors.bookContext ? {error:true} : null
                }
                helperText={errors?.bookContext?.message}
                size="large"
                {...register("bookContext", {
                    required: {
                        value: true,
                        message: 'Book is required'
                    },
                    pattern: {
                        value: /^(\d+\.)+\d+$/,
                        message: 'Book Context is not a valid format ( ex: 1.2)'
                    }
                  })
                } 
            />
        </Box>
        <Box sx={{paddingTop: 3, paddingLeft: 1}}>
            <Button type="submit" variant="contained" size="large" fullWidth>Add Verse</Button>
        </Box>
    </Box>
  );
}
