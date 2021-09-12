import getDb from "../../../mongo";
import corsWrapper from "../../../lib/corsWrapper";
import { getSession } from 'next-auth/client';

const addWord = async (text,language,script,email) => {
    const db = await getDb();
    const user = await db.collection('users').findOne({email});
    const words = db.collection('words');
    const word = await words.findOne({text, language});
    if(word) {
        return word;
    }
    if(user) {
        await words.insertOne({
            text,
            language,
            script,
            createdBy: user.id,
            createdAt: new Date()
        });
        return words.findOne({text});
    }
    else {
        throw(new Error('User not found'));    
    }
};

async function handler(req, res) {
    try {
        if (req.method === 'POST') {
            const session = await getSession({ req });
            if(session) {
                const { user: {email}} = session;
                const { text, language, script } = req.body;
                const word = await addWord(text,language,script,email);
                return res.json(word);
            }
        }
        return res.status(401).send('Not Authenticated');
    } catch(e) {
        res.status(500).send(e.message);
    }    
}

export default corsWrapper(handler);