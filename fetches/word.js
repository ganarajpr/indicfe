import axios from "axios";
export const addWord = async (text, script, language, translation, book, bookContext) => {
    if(!text || !script || !language || !translation
            || !book || !bookContext ) {
        throw new Error('value missing in add word');
    }
    try {
        const res = await axios.post('/api/word', {
            text,
            language,
            script,
            translation,
            book,
            bookContext
        });
        return res.data;
    }
    catch(e) {
        console.log(e);
        return {};
    }    
};

export const getWord = async(text) => {
    if(!text) {
        throw new Error('value missing in get word');
    }
    try {
        const res = await axios.get(`/api/word/${text}`);
        return res.data;
    } catch(e) {
        console.log(e);
        return {};
    }
};


export const deleteTranslationForWord = async(wordId, book, bookContext) => {
    if(!wordId || !book || !bookContext) {
        throw new Error('value missing in delete translation');
    }
    try {
        const res = await axios.post(`/api/word/remove`, {
            wordId,
            book,
            bookContext
        });
        return res.data;    
    } catch(e) {
        console.log(e);
        return {};
    }
};