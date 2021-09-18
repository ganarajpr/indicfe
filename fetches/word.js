import axios from "axios";
export const addWord = async (text, script, language, translation) => {
    const res = await axios.post('/api/word', {
        text,
        language,
        script,
        translation
    });
    return res;
};

export const getWord = async(word) => {
    const res = await axios.get(`/api/word/${word}`);
    return res.data;
};