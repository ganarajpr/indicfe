import axios from "axios";
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