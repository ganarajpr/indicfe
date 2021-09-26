import getDb from "../../../mongo";
import corsWrapper from "../../../lib/corsWrapper";
import { getSession } from 'next-auth/client';
import { ObjectId } from 'mongodb';
import { getWordById, getWordByText } from "./_core";
import { addVoteOnTranslationLocation } from "../votes/_core";

const addTranslationToWord = async (word, book, bookContext, user) => {
    const db = await getDb();
    const words = db.collection('words');
    const wordInLocation = word.locations.filter ( location => {
        return location.book === book && location.bookContext === bookContext; 
    });
    await addVoteOnTranslationLocation(word._id, book, bookContext,user.id, 1);
    if(wordInLocation.length) {
        return word;
    } else {
        return words.updateOne({_id: ObjectId(word._id)}, {
            $push: {
                locations: {
                    book,
                    bookContext,
                    votes: 1,
                    createdBy: user.id,
                    createdAt: new Date()
                }
            }
        });
    }
};

const addWord = async (text, lang, script, translation, book, bookContext, user) => {
    const db = await getDb();
    const words = db.collection('words');
    const word = await words.findOne({text, lang, translation});
    if(!user) {
        throw(new Error('User not found'));    
    }
    if(word) {
        await addTranslationToWord(word, book, bookContext, user);
        return getWordById(word._id);
    } else {
        await words.insertOne({
            text,
            lang,
            script,
            translation,
            locations: [
                {
                    book,
                    bookContext,
                    votes: 1,
                    createdBy: user.id,
                    createdAt: new Date()
                }
            ],
            votes: 1,
            createdBy: user.id,
            createdAt: new Date()
        });
        const word = await getWordByText(text);
        await addVoteOnTranslationLocation(word.translations[0]._id, book, bookContext,user.id, 1);
        return word;
    }
};

async function handler(req, res) {
    try {
        if (req.method === 'POST') {
            const session = await getSession({ req });
            if(session) {
                const { user} = session;
                const { text, language, script, translation, book, bookContext } = req.body;
                const word = await addWord(text,language,script,translation, book, bookContext, user);
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