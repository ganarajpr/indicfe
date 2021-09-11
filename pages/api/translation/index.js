import getDb from "../../../mongo";
import corsWrapper from "../../../lib/corsWrapper";


/// Needs to be deduped.
const addTranslation = async (req) => {
    const { text, language, script, word } = req.body;
    const db = await getDb();
    const words = db.collection('words');
    await words.updateOne(
        {text: word}, {
            $push: {
                translations: {
                    text,
                    language,
                    script,
                    createdAt: new Date()
                }
            }
        } 
    );
    return words.findOne({text: word});
};

async function handler(req, res) {
    if (req.method === 'POST') {
        const word = await addTranslation(req);
        return res.json(word);
    }
}

export default corsWrapper(handler);