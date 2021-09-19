import axios from "axios";
export const addWord = async (text, script, language, translation) => {
    if(!text || !script || !language || !translation) {
        throw new Error('value missing in add word');
    }
    const res = await axios.post('/api/word', {
        text,
        language,
        script,
        translation
    });
    return res.data;
};

export const getWord = async(text) => {
    if(!text) {
        throw new Error('value missing in get word');
    }
    const res = await axios.get(`/api/word/${text}`);
    return res.data;
};


export const deleteTranslationForWord = async(wordId, translation) => {
    if(!wordId || !translation) {
        throw new Error('value missing in delete translation');
    }
    console.log('delete transl', wordId, translation);
    const res = await axios.post(`/api/word/remove`, {
        wordId,
        translation
    });
    return res.data;
};