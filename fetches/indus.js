import axios from "axios";

export const getSeals = async () => {
    const res = await axios.get('/api/indus');
    return res.data;
};
