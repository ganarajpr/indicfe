import corsWrapper from "../../../../lib/corsWrapper";
import { getScreenshot } from '../../../../lib/chromium';

async function handler(req, res) {
    if (req.method === 'GET') {
        const { book, bookContext } = req.query;
        const finalBookContext = bookContext.replace('.jpg', '');
        const url = `https://smrthi.com/embed/${book}/${finalBookContext}`;
        const isDev = process.env.DEV === 'true';
        const file = await getScreenshot(url, isDev);
        res.statusCode = 200;
        res.setHeader('Content-Type', `image/jpeg`);
        res.end(file);
    } 
}

export default corsWrapper(handler);
