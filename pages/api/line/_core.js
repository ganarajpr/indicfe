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
    const line = await  db.collection('lines').findOne(
            {book, context},
            { projection: {createdBy: 0, createdAt: 0} }
    );
    line.prevContext = await getPrevContext(book, line.sequence);
    line.nextContext = await getNextContext(book, line.sequence);
    return getWordsofLine(line);
};

export const getOnlyLine = async (book, bookContext) => {
    const db = await getDb();
    const context = extractBookContext(bookContext);
    const queryFormat = convertToQueryFormat(context, 'context');
    const lines = await  db.collection('lines').findOne(
            {book, ...queryFormat},
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

const convertToBookContext = (context) => {
    const keys = _.keys(context);
    let i =0;
    const ctx = [];
    while(i< keys.length) {
        ctx.push(context[`L${i+1}`]);
        i++;
    }
    return ctx.join('.');
};

const getChapterOfLine = (context) => {
    const max = _.keys(context).length;
    if (max > 1 ) {
        return _.omit(context, `L${max}` );
    }    
    return context;
};

const getFirstChapterContext = async (book, context) => {
    const db = await getDb();
    const queryFormat = convertToQueryFormat(context, 'context');
    console.log(queryFormat);
    const line = await db.collection('lines').findOne(
        {
            book, 
            ...queryFormat
        }, 
        {
            projection: { context: 1, sequence: 1, bookContext: 1},
            sort: { sequence: 1 }
        }
    );
    return getChapterOfLine(line.context);
};

const getNextLine = async (book, sequence) => {
    const db = await getDb();
    const line = await db.collection('lines').findOne(
        {
            book, 
            sequence : { $gt: sequence }            
        }, 
        {
            projection: { context: 1, sequence: 1, bookContext: 1},
            sort: { sequence: 1 },
            limit: 1
        }
    );
    if(line && line.context) {
        return line;
    }
    return null;    
};

const getPrevLine = async (book, sequence) => {
    const db = await getDb();
    const line = await db.collection('lines').findOne(
        {
            book, 
            sequence : { $lt: sequence }            
        }, 
        {
            projection: { context: 1, sequence: 1, bookContext: 1},
            sort: { sequence: -1 },
            limit: 1
        }
    );
    if(line && line.context) {
        return line;
    }
    return null;
};

const getNextContext = async (book, sequence) => {
    const line = await getNextLine(book, sequence);
    if(line && line.context) {
        return convertToBookContext(line.context);
    }
    return null;
};

const getPrevContext = async (book, sequence) => {
    const line = await getPrevLine(book, sequence);
    if(line && line.context) {
        return convertToBookContext(line.context);
    }
    return null;
};

const getNextChapterContext = async (book, sequence) => {
    const line = await getNextLine(book, sequence);
    if(line && line.context) {
        const linech = getChapterOfLine(line.context);
        return convertToBookContext(linech);
    }
    return null;
};

const getPrevChapterContext = async (book, sequence) => {
    const line = await getPrevLine(book, sequence);
    if(line && line.context) {
        const linech = getChapterOfLine(line.context);
        return convertToBookContext(linech);
    }
    return null;
};

const getChapter = async (book, context) => {
    const db = await getDb();
    const chpQuery = convertToQueryFormat(context, 'context');
    const lines = await db.collection('lines').find(
        {
            book, 
            ...chpQuery
        }, 
        {
            projection: { createdAt: 0, createdBy: 0},
            sort: { sequence: 1 }
        }
    ).toArray();
    return lines;
}


export const getBookChapter = async (book, chNo) => {
    try {
        const context = extractBookContext(chNo);
        const chapterContext = await getFirstChapterContext(book, context);
        const lines = await getChapter(book, chapterContext);
        const chp = getChapterOfLine(lines[0].context);
        const chapter = convertToBookContext(chp);
        const nextContext = await getNextChapterContext(book, lines[lines.length -1].sequence);
        const prevContext = await getPrevChapterContext(book, lines[0].sequence);
        return { lines, chapter, nextContext, prevContext };
    } catch(e) {
        console.log(e);
        return e;
    }
};
