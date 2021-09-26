import getDb from "../../../../mongo";
import corsWrapper from "../../../../lib/corsWrapper";
import { getSession } from 'next-auth/client';
import { ObjectId } from 'mongodb';
import { getWordById } from "../_core";
import _ from "lodash-es";
import { removeVoteOnTranslationLocation } from "../../votes/_core";

const deleteTranslationForWord = async (wordId, book, bookContext, user) => {
    const db = await getDb();
    const words = db.collection('words');
    if(!user) {
        throw(new Error('User not found'));    
    }
    const word = await words.findOne({_id: ObjectId(wordId)});
    const index = _.find(word.locations, { book, bookContext});
    if(index < 0) {
        return;        
    }
    await removeVoteOnTranslationLocation(wordId, book, bookContext, user.id);
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