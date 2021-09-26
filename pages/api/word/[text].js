import getDb from "../../../mongo";
import corsWrapper from "../../../lib/corsWrapper";
import { keyBy, uniq } from "lodash-es";

const getWord = async (req) => {
    const { text } = req.query;    
    const db = await getDb();
    const translations = await db.collection('words').find({text}).toArray();
    
    if(translations && translations.length) {
        const userIds = translations.map( (t) => t.createdBy);
        const uniqUserIds = uniq(userIds);
        const users = await db.collection('users').find({id: {$in: uniqUserIds}}).toArray()
        const userById = keyBy(users, 'id');
        const trWithUser =  translations.map( t => {
            t.user = userById[t.createdBy];
            return t;
        });
        word.translations = trWithUser;
    }
    return word;
}

async function handler(req, res) {    
    if (req.method === 'GET') {
        try {
            const word = await getWord(req);
            return res.json(word);
        } catch(e) {
            return res.json({});
        }
        
    }
}

export default corsWrapper(handler);