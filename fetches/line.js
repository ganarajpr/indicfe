import axios from "axios";
export const addLine = async (text, script, language) => {
    const res = await axios.post('/api/line', {
        text,
        language,
        script
    });
    return res;
};