import getDb from "../../../mongo";
import corsWrapper from "../../../lib/corsWrapper";
import { getLineByBookAndContext } from "../line/_core";


const parseBookAndContext = (url) => {
    const embedUrl = new URL(url);
    const [_,__, book, bookContext] = embedUrl.pathname.split('/');
    return {
        book,
        bookContext
    };
};

const getEmbedResponse = async (url) => {
    const {book, bookContext} = parseBookAndContext(url);
    const resp = {
        "version": "1.0",
        "type": "rich",
        "width": 550,
        "height": 300,
        "thumbnail_width": 550,
        "thumbnail_height": 300,
        "thumbnail_url": "http://www.smrthi.com/",    
        "title": `${book} ${bookContext}`,
        "provider_name": "smrthi",
        "provider_url": "http://www.smrthi.com/",
        "author_name": "smrthi",
        "author_url": "https://www.smrthi.com",
        "html": `<iframe width='550' height='250' 
        src=\"https://www.smrthi.com/embed/${book}/${bookContext}\">`
    };
    return resp;
};

async function handler(req, res) {
    const { url } = req.query;
    try {
        const response = await getEmbedResponse(url);
        return res.json(response);
    } catch(e) {
        return res.status(404).send('NOT FOUND');
    }
}

export default corsWrapper(handler);
