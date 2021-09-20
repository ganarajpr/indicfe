import getDb from "../../../../mongo";
import corsWrapper from "../../../../lib/corsWrapper";
import { getSession } from 'next-auth/client';
import { ObjectId } from 'mongodb';
import { getWordById } from "../_core";

const deleteTranslationForWord = async (wordId, translation, user) => {
    const db = await getDb();
    const words = db.collection('words');
    if(!user) {
        throw(new Error('User not found'));    
    }
    await words.updateOne({_id: ObjectId(wordId)},
            { $pull : { translations: { text: translation } } }
        )
    return getWordById(wordId);
};

async function handler(req, res) {
    try {
        if ( req.method === 'POST') {
            const session = await getSession({ req });            
            if(session) {
                const { user } = session;
                const { wordId, translation } = req.body;
                const word = await deleteTranslationForWord(wordId, translation, user);
                return res.json(word);
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