import getDb from "../../../mongo";
import corsWrapper from "../../../lib/corsWrapper";

const getLine = async (req) => {
    const { text } = req.query;
    const db = await getDb();
    return db.collection('lines').findOne({text});
}

async function handler(req, res) {
    if (req.method === 'GET') {
        const word = await getLine(req);
        return res.json(word);
    }
}

export default corsWrapper(handler);