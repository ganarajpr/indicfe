import axios from "axios";
axios.defaults.baseURL = process.env.NEXTAUTH_URL;
export const addLine = async (text, script, language) => {
    const res = await axios.post('/api/line', {
        text,
        language,
        script
    });
    return res;
};


export const addWordToLine = async(wordId, lineId) => {
    const res = await axios.post(`/api/line/contains`, {
        lineId,
        wordId
    });
    return res;
};

export const getLine = async(lineId) => {
    const res = await axios.get(`/api/line/${lineId}`);
    console.log('response', res);
    return res.data;
};