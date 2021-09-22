import axios from "axios";
export const addLine = async (text, script, language, book, bookContext) => {
    const res = await axios.post('/api/line', {
        text,
        language,
        script,
        book,
        bookContext
    });
    return res;
};


export const addWordToLine = async(id, word) => {
    const res = await axios.put(`/api/line`, {
        id,
        word
    });
    return res;
};

export const getLine = async(book, bookContext) => {
    const res = await axios.get(`/api/line/${book}/${bookContext}`);
    return res.data;
};

export const addFullTranslation = async(lineId, translation) => {
    const res = await axios.put(`/api/line`, {
        id: lineId,
        translation
    });
    return res.data;
};


export const deleteTranslationForLine = async(lineId, translationId) => {
    if(!lineId || !translationId) {
        throw new Error('value missing in delete translation for line');
    }
    const res = await axios.post(`/api/translation/remove`, {
        lineId,
        translationId
    });
    return res.data;
};