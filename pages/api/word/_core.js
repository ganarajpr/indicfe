import { ObjectId } from 'mongodb';
import getDb from '../../../mongo';
import { keyBy, uniq } from "lodash-es";

export const getWordByText = async (text) => {
    const db = await getDb();
    const word =  await db.collection('words').findOne({text});
    const translations = word.translations;
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



export const getWordById = async (id) => {
    const db = await getDb();
    const word = await db.collection('words').findOne({_id:ObjectId(id)});
    const translations = word.translations; 
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

export const upsertWord = async (text, language, script, createdBy) => {
    const db = await getDb();
    const words = db.collection('words');
    const word = await words.findOne({text});
    if(!word) {
        await words.insertOne({
            text,
            language,
            script,
            createdBy,
            createAt: new Date()
        });
        return words.findOne({text});
    }
    return word;
}