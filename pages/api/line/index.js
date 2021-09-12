import getDb from "../../../mongo";
import corsWrapper from "../../../lib/corsWrapper";
import { getSession } from 'next-auth/client';

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
        const session = await getSession({ req });
        console.log(session, "session information on post");
        if(session) {
            const word = await addLine(req);
            return res.json(word);
        }

    }
}

export default corsWrapper(handler);