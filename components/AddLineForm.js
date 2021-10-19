import React, { useEffect } from "react";
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

export default function AddLineForm() {
  const { handleSubmit, reset, control, register } = useForm({ defaultValues });
  const onSubmit = data => console.log(data);

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{
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
            <Controller
                render={
                ({ field }) => <TextField
                id="line-paragraph"
                label="Paragraph or Shloka or Mantra"
                variant="standard"
                multiline
                required
                fullWidth
                placeholder="1 Paragraph or Shloka or Mantra or Verse"
                maxRows={8}
                rows={8}
                {
                    ...field
                }
                />
                }
                control={control}
                name="line"
            />
        </Box>
        <Box sx={{paddingTop: 1}}>
            <Controller
                render={
                ({ field }) => <TextField
                id="line-book"
                label="Book"
                placeholder="ex: RigVeda"
                variant="standard"
                fullWidth
                required
                size="Normal"
                {
                    ...field
                }
                />
                }
                control={control}
                name="book"
            />
        </Box>
        <Box sx={{paddingTop: 1}}>
            <TextField
                id="line-book"
                label="BookContext"
                variant="standard"
                placeholder="ex: 10.5.3 for chapter 10 hymn 5 verse 3"
                fullWidth
                required
                size="large"
                {...register("bookContext", {
                    required: true,
                    pattern: /^(\d+\.)+\d+$/
                  })
                } 
            />
        </Box>
        <Box sx={{paddingTop: 3, paddingLeft: 1}}>
            <Button type="submit" variant="contained" fullWidth>Add Verse</Button>
        </Box>
    </Box>
  );
}
