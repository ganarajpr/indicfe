import LanguageContext from '../shared/LanguageContext';
import { useContext } from "react";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

export default function LanguageSelector () {
    const { language, setLanguage } = useContext(LanguageContext);
    const onSelectLanguage = (e) => {
        setLanguage(e.target.value);
    };
    return (
        <FormControl >
            <InputLabel id="demo-simple-select-label">Language</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                autoWidth
                defaultValue="devanagari"
                sx= {{backgroundColor: '#fff', color: 'text.secondary', mr: 5}}
                onChange={onSelectLanguage}
                value={language}
                label="Age">
                <MenuItem value="devanagari">Sanskrit</MenuItem>
                <MenuItem value="kannada">Kannada</MenuItem>
                <MenuItem value="telugu">Telugu</MenuItem>
                <MenuItem value="tamil">Tamil</MenuItem>
                <MenuItem value="iast">English</MenuItem>
            </Select>
        </FormControl>
    );
}