import getDb from "../../../mongo";
import { ObjectId } from 'mongodb';
import { getWordforAllText } from "../word/_core";

export const getLineByTextAndLanguage = async (text, language) =>{
    const db = await getDb();
    const lines = db.collection('lines');
    const line = await lines.findOne({text, language});
    return getWordsofLine(line);
};

const getWordsofLine = async (lines) => {
    const words = lines.text.split('\n').join(' ').split(' ');
    const wordTranslations = await getWordforAllText(words);
    lines.words = wordTranslations;
    return lines;
};

export const getLineByText = async (text) =>{
    const db = await getDb();
    const lines = db.collection('lines');
    const line = await lines.findOne(
        {text},
        { projection: {createdBy: 0, createdAt: 0} }
    );
    return getWordsofLine(line);
};

export const getLineById = async (id) => {
    const db = await getDb();
    const lines = db.collection('lines');
    const line = await lines.findOne(
        {_id: ObjectId(id)},
        { projection: {createdBy: 0, createdAt: 0} }
    );
    return getWordsofLine(line);
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
                createdAt: new Date(),
                _id: ObjectId()
            }
        }        
    });
    return getLineById(updateObject.id);
};


export const getLineByBookAndContext = async (book, bookContext) => {
    const db = await getDb();
    const lines = await  db.collection('lines').findOne(
            {book, bookContext},
            { projection: {createdBy: 0, createdAt: 0} }
        );
    return getWordsofLine(lines);
};

function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export const getBookChapter = async (book, chapter) => {
    const db = await getDb();
    console.log('getting book chapter');
    const lines = await db.collection('lines').find(
        {   
            book,
            bookContext: { $regex: '^'+escapeRegExp(chapter+'.') }
        },
        { projection: {createdBy: 0, createdAt: 0} }
    ).toArray();
    return lines;
    // return Promise.all(
    //     lines.map( async (line) => getWordsofLine(line) )
    // );
};
