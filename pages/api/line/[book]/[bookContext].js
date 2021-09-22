import getDb from "../../../../mongo";
import corsWrapper from "../../../../lib/corsWrapper";
import { getLineByBookAndContext } from '../_core';


async function handler(req, res) {
    if (req.method === 'GET') {
        const { book, bookContext } = req.query;
        const line = await getLineByBookAndContext(book, bookContext);
        return res.json(line);
    } 
}

export default corsWrapper(handler);