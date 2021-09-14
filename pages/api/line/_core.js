import getDb from "../../../mongo";
import { upsertWord } from "../word/_core";
import { ObjectId } from 'mongodb';

export const getLineByTextAndLanguage = async (text, language) =>{
    const db = await getDb();
    const lines = db.collection('lines');
    const line = await lines.findOne({text, language});
    return line;
};

export const getLineByText = async (text) =>{
    const db = await getDb();
    const lines = db.collection('lines');
    const line = await lines.findOne({text});
    return line;
};

export const updateLine = async (updateObject) => {
    const db = await getDb();
    const lines = db.collection('lines');
    const user = await db.collection('users').findOne({email: updateObject.email});
    const userId = user.id;
    const word = await upsertWord(updateObject.word, updateObject.language, 
        updateObject.script, userId);
    lines.updateOne({_id: ObjectId(updateObject.id)}, {
        $push: {
            words: {
                id: word._id,
                text: word.text,
                createdBy: userId
            }
        }        
    });
};

