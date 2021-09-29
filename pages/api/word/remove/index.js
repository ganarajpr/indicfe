import getDb from "../../../../mongo";
import corsWrapper from "../../../../lib/corsWrapper";
import { getSession } from 'next-auth/client';
import { ObjectId } from 'mongodb';
import { getWordById, downVoteLocation } from "../_core";
import _ from "lodash-es";

const deleteTranslationForWord = async (wordId, book, bookContext, user) => {
    const db = await getDb();
    const words = db.collection('words');
    if(!user) {
        throw(new Error('User not found'));    
    }
    const word = await words.findOne({_id: ObjectId(wordId)});
    if(word.createdBy === user.id) {
        // I am the creator
        if(word.locations.length === 1 && word.votes === 1) {
            // only 1 location and only 1 vote - so its safe to delete
            await words.deleteOne({_id: ObjectId(wordId)});
        }
    }
    return getWordById(wordId);
};

async function handler(req, res) {
    try {
        if ( req.method === 'POST') {
            const session = await getSession({ req });            
            if(session) {
                const { user } = session;
                const { wordId, book, bookContext } = req.body;
                const word = await deleteTranslationForWord(wordId, book, bookContext, user);
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