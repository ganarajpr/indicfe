import getDb from "../../../mongo";
import { ObjectId } from 'mongodb';
import { getWordforAllText } from "../word/_core";
import _ from 'lodash-es';
import { KeyboardSharp } from "@mui/icons-material";

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


export const updateLineText = async (updateObject) => {
    const db = await getDb();
    const lines = db.collection('lines');
    await lines.updateOne({_id: ObjectId(updateObject.id)}, {
        $set: {
            text: updateObject.text
        }        
    });
    return getLineById(updateObject.id);
};

const extractBookContext = (bookContext) => {
    const context = bookContext.split('.');
    const levels = context.reduce((prev,cur,index) => {
        prev[`L${index+1}`] = +cur;
        return prev;
    },{});
    return levels;    
};

export const getLineByBookAndContext = async (book, bookContext) => {
    const db = await getDb();
    const context = extractBookContext(bookContext);
    const lines = await  db.collection('lines').findOne(
            {book, context},
            { projection: {createdBy: 0, createdAt: 0} }
        );
    return getWordsofLine(lines);
};

export const getOnlyLine = async (book, bookContext) => {
    const db = await getDb();
    const context = extractBookContext(bookContext);
    const lines = await  db.collection('lines').findOne(
            {book, context},
            { projection: {createdBy: 0, createdAt: 0} }
        );
    return lines;
};

const convertToQueryFormat = (context, root) => {
    const keys = _.keys(context);
    const query = keys.reduce((prev, cur) => {
        prev[`${root}.${cur}`] = context[cur];
        return prev;
    }, {});
    return query;
};

const getNextLevel = (context) => {
    const max = _.keys(context).length;
    return `L${max+1}`;
};

export const getBookChapter = async (book, chapter) => {
    const db = await getDb();
    const context = extractBookContext(chapter);
    const queryFormat = convertToQueryFormat(context, 'context');
    const line = await db.collection('lines').findOne({book, ...queryFormat}, {projection: { context: 1}});
    if( _.keys(line.context).length === _.keys(queryFormat).length + 1) {
        const lines = await db.collection('lines').find(
            {   
                book,
                ...queryFormat
            },
            { projection: {createdBy: 0, createdAt: 0} }
        ).toArray();
        return lines;
    } else {
        const nextLevel = getNextLevel(context);
        const lines = await db.collection('lines').find(
            {   
                book,
                ...queryFormat,
                [`context.${nextLevel}`]: 1
            },
            { projection: {createdBy: 0, createdAt: 0} }
        ).toArray();
        return lines;
    }

};
