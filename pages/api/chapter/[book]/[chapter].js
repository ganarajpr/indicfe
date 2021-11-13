import corsWrapper from '../../../../lib/corsWrapper';
import { getBookChapter} from '../../line/_core';

async function handler(req, res) {
    if (req.method === 'GET') {
        const { book, chapter } = req.query;
        const lines = await getBookChapter(book, chapter);
        return res.json(lines);
    } 
}

export default corsWrapper(handler);