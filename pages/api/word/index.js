import getDb from "../../../mongo";
import corsWrapper from "../../../lib/corsWrapper";

const addWord = async (req) => {
    const { text, language, script } = req.body;
    const db = await getDb();
    const words = db.collection('words');
    await words.insertOne({
        text,
        language,
        script,
        createdAt: new Date()
    });
    return words.findOne({text});
};

async function handler(req, res) {
    if (req.method === 'POST') {
        const word = await addWord(req);
        return res.json(word);
    }
}

export default corsWrapper(handler);