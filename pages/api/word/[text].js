import getDb from "../../../mongo";
import corsWrapper from "../../../lib/corsWrapper";

const getWord = async (req) => {
    const { text } = req.query;
    const db = await getDb();
    return db.collection('words').findOne({text});
}

async function handler(req, res) {
    if (req.method === 'GET') {
        const word = await getWord(req);
        return res.json(word);
    }
}

export default corsWrapper(handler);