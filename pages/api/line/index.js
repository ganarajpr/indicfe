import getDb from "../../../mongo";
import corsWrapper from "../../../lib/corsWrapper";
import { getSession } from 'next-auth/client';

const addLine = async (text,language,script,email) => {
    const db = await getDb();
    const user = await db.collection('users').findOne({email});
    const lines = db.collection('lines');
    if(user) {
        console.log('user found', user);
        await lines.insertOne({
            text,
            language,
            script,
            createdBy: user.id,
            createdAt: new Date()
        });
        return lines.findOne({text});
    }
    throw(new Error('User not found'));    
};

async function handler(req, res) {
    try {
        if (req.method === 'POST') {
            const session = await getSession({ req });
            if(session) {
                console.log(session);
                const { user: {email}} = session;
                const { text, language, script } = req.body;
                const word = await addLine(text,language,script,email);
                return res.json(word);
            }
        }
        return res.status(401).send('Not Authenticated');
    } catch(e) {
        res.status(500).send(e.message);
    }    
}

export default corsWrapper(handler);