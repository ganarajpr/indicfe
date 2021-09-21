import getDb from "../../../mongo";
import corsWrapper from "../../../lib/corsWrapper";

const getBooks = async () => {
    const db = await getDb();
    return db.collection('lines').distinct('book');
};

async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            const books = await getBooks();
            return res.json({books});
        }
        return res.status(404).send('NOT FOUND');
    } catch(e) {
        res.status(500).send(e.message);
    }    
}

export default corsWrapper(handler);