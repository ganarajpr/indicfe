import getDb from "../../../mongo";
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

export const getLineById = async (id) => {
    const db = await getDb();
    const lines = db.collection('lines');
    return lines.findOne({_id: ObjectId(id)});
};

export const updateLine = async (updateObject, user) => {
    const db = await getDb();
    const lines = db.collection('lines');
    const userId = user.id;
    await lines.updateOne({_id: ObjectId(updateObject.id)}, {
        $push: {
            translations: {
                text: updateObject.translation,
                createdBy: userId,
                createdAt: new Date()
            }
        }        
    });
    return getLineById(updateObject.id);
};

