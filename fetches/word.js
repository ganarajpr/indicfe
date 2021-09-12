import axios from "axios";
export const addWord = async (text, script, language) => {
    const res = await axios.post('/api/word', {
        text,
        language,
        script
    });
    return res;
};