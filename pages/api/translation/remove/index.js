import getDb from "../../../../mongo";
import corsWrapper from "../../../../lib/corsWrapper";
import { getSession } from 'next-auth/client';
import { ObjectId } from 'mongodb';
import { getLineById } from "../../line/_core";

const deleteTranslationForLine = async (lineId, translationId, user) => {
    const db = await getDb();
    const lines = db.collection('lines');
    if(!user) {
        throw(new Error('User not found'));    
    }
    await lines.updateOne({_id: ObjectId(lineId)},
            { $pull : { translations: { _id: ObjectId(translationId) } } }
        )
    return getLineById(lineId);
};

async function handler(req, res) {
    try {
        if ( req.method === 'POST') {
            const session = await getSession({ req });            
            if(session) {
                const { user } = session;
                const { lineId, translationId } = req.body;
                const line = await deleteTranslationForLine(lineId, translationId, user);
                return res.json(line);
            } else {
                return res.status(401).send('Not Authenticated');
            }
        } else {
            return res.status(404).send('Not Found');
        }
        
    } catch(e) {
        res.status(500).send(e.message);
    }    
}

export default corsWrapper(handler);