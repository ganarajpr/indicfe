import getDb from "../../../mongo";
import corsWrapper from "../../../lib/corsWrapper";
import { getSession } from 'next-auth/client';
import { ObjectId } from 'mongodb';
import { getWordById } from "./_core";

const addTranslationToWord = async (word, translation, user) => {
    const db = await getDb();
    const words = db.collection('words');
    const wordWithTranslation = await words.findOne({_id: ObjectId(word._id), "translations.$.text": translation});
    if(wordWithTranslation) {
        return wordWithTranslation;
    } else {
        await words.updateOne({_id: ObjectId(word._id)}, {
            $push: {
                translations: {
                    text: translation,
                    createdBy: user.id,
                    createdAt: new Date(),
                    language: 'English'
                }
            }
        });
    }
};

const addWord = async (text,language,script, translation, email) => {
    const db = await getDb();
    const words = db.collection('words');
    const user = await db.collection('users').findOne({email});    
    const word = await words.findOne({text, language});
    if(!user) {
        throw(new Error('User not found'));    
    }
    if(word) {
        await addTranslationToWord(word, translation, user);
        return getWordById(word._id);
    } else {
        await words.insertOne({
            text,
            language,
            script,
            translations: [{
                text: translation,
                createdBy: user.id,
                createdAt: new Date(),
                language: 'English'
            }],
            createdBy: user.id,
            createdAt: new Date()
        });
        return getWordById(word._id);
    }
};

async function handler(req, res) {
    try {
        if (req.method === 'POST') {
            const session = await getSession({ req });
            if(session) {
                const { user: {email}} = session;
                const { text, language, script, translation } = req.body;
                const word = await addWord(text,language,script,translation, email);
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