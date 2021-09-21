import getDb from "../../../mongo";
import corsWrapper from "../../../lib/corsWrapper";
import { getSession } from 'next-auth/client';
import { updateLine } from "./_core";
const addLine = async (text,language,script,book, bookContext, user) => {
    const db = await getDb();
    const lines = db.collection('lines');
    const line = await lines.findOne({text, language});
    if(!user) {
        throw(new Error('User not found'));
    }
    if(!line) {
        await lines.insertOne({
            text,
            language,
            script,
            book,
            bookContext,
            createdBy: user.id,
            createdAt: new Date()
        });
        return lines.findOne({text});
    }
    return line;
};

async function handler(req, res) {
    try {
        if (req.method === 'POST') {
            const session = await getSession({ req });
            if(session) {
                const { user} = session;
                const { text, language, script, book, bookContext } = req.body;
                const line = await addLine(text,language,script,book, bookContext, user);
                return res.json(line);
            } else {
                return res.status(401).send('Not Authenticated');
            }
        } else if (req.method === 'PUT') {
            const session = await getSession({ req });
            if(session) {
                const { user } = session;
                const { id, translation } = req.body;
                const updateObject = {
                    id,
                    translation
                };
                const line = await updateLine(updateObject, user);
                return res.json(line);
            } else {
                return res.status(401).send('Not Authenticated');
            }
        } 
        
    } catch(e) {
        res.status(500).send(e.message);
    }    
}

export default corsWrapper(handler);