import getDb from "../../../mongo";
import { ObjectId } from 'mongodb';
import { getWordforAllText } from "../word/_core";
import _ from 'lodash-es';

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

const getNextContext = async (context) => {
    const max = _.keys(context).length;
};

const getMinNextLevel = async (book, context) => {
    const db = await getDb();
    const queryFormat = convertToQueryFormat(context, 'context');
    const nextLevel = getNextLevel(context);
    const agg = await db.collection('lines')
        .aggregate([
            {
                $match: {
                    book,
                    ...queryFormat
                }
            },
            {
                $group: {
                    _id: null,
                    minNextLevel: { $min: `$context.${nextLevel}`}
                }
            }
        ]).toArray();
    console.log(agg);
    const nxt = agg.length ? agg[0].minNextLevel: null;
    return nxt;
};

export const getBookChapter = async (book, chapter) => {
    const db = await getDb();
    try {
        const context = extractBookContext(chapter);
        console.log(context);
        const queryFormat = convertToQueryFormat(context, 'context');
        console.log(queryFormat);
        const nextLevel = getNextLevel(context);
        console.log(nextLevel);
        const nxt = await getMinNextLevel(book, context);
        console.log(nxt);
        const query = {   
            book,
            ...queryFormat
        };
        if(nxt !== null) {
            query[`context.${nextLevel}`] = nxt;
        }
        console.log('qery',query);
        const lines = await db.collection('lines').find( query,
            { projection: {createdBy: 0, createdAt: 0} }
        ).toArray();
        const chp = nxt ? `${chapter}.${nxt}`: chapter;
        return { lines, chapter: chp };
    } catch(e) {
        console.log(e);
        return e;
    }
};
