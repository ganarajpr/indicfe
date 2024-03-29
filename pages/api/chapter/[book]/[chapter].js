import corsWrapper from '../../../../lib/corsWrapper';
import { getBookChapter} from '../../line/_core';

async function handler(req, res) {
    if (req.method === 'GET') {
        const { book, chapter } = req.query;
        console.log('getting book chapter', book, chapter);
        const data = await getBookChapter(book, chapter);
        return res.json(data);
    } 
}

export default corsWrapper(handler);