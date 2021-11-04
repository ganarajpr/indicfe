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
    const line = await getLineByBookAndContext(book, bookContext);
    const resp = {
        "version": "1.0",
        "type": "rich",
        "width": 550,
        "height": null,
        "title": `${book} ${bookContext}`,
        "provider_name": "smrthi",
        "provider_url": "http://www.smrthi.com/",
        "html": `<p>${line.text}</p><p>${line.book} ${line.bookContext}</p>`
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
