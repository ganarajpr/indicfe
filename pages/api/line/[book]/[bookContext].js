import getDb from "../../../../mongo";
import corsWrapper from "../../../../lib/corsWrapper";

const getLine = async (book, bookContext) => {
    const db = await getDb();
    return db.collection('lines').findOne(
            {book, bookContext},
            { projection: {createdBy: 0, createdAt: 0} }
        );
}

async function handler(req, res) {
    if (req.method === 'GET') {
        const { book, bookContext } = req.query;
        const line = await getLine(book, bookContext);
        return res.json(line);
    } 
}

export default corsWrapper(handler);