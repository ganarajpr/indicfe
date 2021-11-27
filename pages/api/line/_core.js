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


const getNextContext = async (book, l1, l2, l3, l4) => {
    const db = await getDb();
    const levels = [];
    if(l4) {
        levels.push([l1, l2, l3, l4+1]);
    }
    if(l3) {
        levels.push([l1, l2, l3+1]);
    }
    if(l2) {
        levels.push([l1, l2+1]);
    }
    if(l1) {
        levels.push( [l1+1] );
    }
    let i = 0;
    while( i < levels.length ) {
        const context = extractBookContext(levels[i].join('.'));
        const queryFormat = convertToQueryFormat(context, 'context');
        const count = await db.collection("lines").countDocuments({book, ...queryFormat});
        if(count > 0) {
            return levels[i].join('.');
        }
        i++;
    }
    return null;
};

const getPrevContext = async (book, l1, l2, l3, l4) => {
    const db = await getDb();
    const levels = [];
    if(l4 && l4 > 0) {
        levels.push([l1, l2, l3, l4-1]);
    }
    if(l3 && l3 > 1) {
        levels.push([l1, l2, l3-1]);
    }
    if(l2 && l2 > 1) {
        levels.push([l1, l2-1]);
    }
    if(l1 && l1 > 1) {
        levels.push( [l1-1] );
    }
    let i = 0;
    while( i < levels.length ) {
        const context = extractBookContext(levels[i].join('.'));
        const queryFormat = convertToQueryFormat(context, 'context');
        const count = await db.collection("lines").countDocuments({book, ...queryFormat});
        if(count > 0) {
            return levels[i].join('.');
        }
        i++;
    }
    return null;
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
    const nxt = agg.length ? agg[0].minNextLevel: null;
    return nxt;
};

export const getBookChapter = async (book, chapter) => {
    const db = await getDb();
    try {
        const context = extractBookContext(chapter);
        const queryFormat = convertToQueryFormat(context, 'context');
        const nextLevel = getNextLevel(context);
        const line = await db.collection('lines').findOne({book, ...queryFormat}, {projection: { context: 1}});
        let nxt = null;
        const query = {   
            book,
            ...queryFormat
        };
        if(_.keys(line.context).length > _.keys(context).length + 1) {
            nxt = await getMinNextLevel(book, context);
        }
        if(nxt !== null) {
            query[`context.${nextLevel}`] = nxt;
            context[nextLevel] = nxt;
        }
        const lines = await db.collection('lines').find( query,
            { projection: {createdBy: 0, createdAt: 0} }
        ).toArray();
        const chp = nxt ? `${chapter}.${nxt}`: chapter;
        const nextContext = await getNextContext(book, context.L1, context.L2, context.L3, context.L4);
        const prevContext = await getPrevContext(book, context.L1, context.L2, context.L3, context.L4);
        return { lines, chapter: chp, nextContext, prevContext };
    } catch(e) {
        console.log(e);
        return e;
    }
};
