import getDb from "../../../mongo";
import corsWrapper from "../../../lib/corsWrapper";

const addLine = async (req) => {
    const { text, language, script } = req.body;
    const db = await getDb();
    const lines = db.collection('lines');
    await lines.insertOne({
        text,
        language,
        script,
        createdAt: new Date()
    });
    return lines.findOne({text});
};

async function handler(req, res) {
    if (req.method === 'POST') {
        const word = await addLine(req);
        return res.json(word);
    }
}

export default corsWrapper(handler);