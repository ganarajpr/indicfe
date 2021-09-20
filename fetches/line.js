import axios from "axios";
axios.defaults.baseURL = process.env.NEXTAUTH_URL;
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

export const getLine = async(lineId) => {
    const res = await axios.get(`/api/line/${lineId}`);
    return res.data;
};