import axios from "axios";
export const getBooks = async () => {
    const res = await axios.get('/api/books');
    return res.data;
};


export const getBook = async (book) => {
    const res = await axios.get(`/api/books/${book}`);
    return res.data;
};