import getDb from "../../../mongo";
import corsWrapper from "../../../lib/corsWrapper";

const getBook = async (book) => {
    const db = await getDb();
    return db.collection('lines').distinct('context.L1', {book} );
};

async function handler(req, res) {
    const { book } = req.query;
    try {
        if (req.method === 'GET') {
            const bookContexts = await getBook(book);
            return res.json({bookContexts});
        }
        return res.status(404).send('NOT FOUND');
    } catch(e) {
        res.status(500).send(e.message);
    }    
}

export default corsWrapper(handler);