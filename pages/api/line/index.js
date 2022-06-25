import getDb from "../../../mongo";
import corsWrapper from "../../../lib/corsWrapper";
import { getSession } from 'next-auth/client';
import { updateLine, updateLineText } from "./_core";
import { ServerSession } from "mongodb";

const contextify = (a) => {
    const pows = [12, 10, 7, 4, 0];
    return a.reduce((prev,cur,index) => {
        const i = pows.length - a.length + index;
        prev = prev+cur*Math.pow(10,pows[i]);
        return prev;
    },0);
};

const extractSequence = (bookContext) => {
    const context = bookContext.split('.');
    return contextify(context);
};

const convertToContextLevels = (bookContext) => {
    const context = bookContext.split('.');
    const levels = context.reduce((prev,cur,index) => {
        prev[`L${index+1}`] = +cur;
        return prev;
    },{});
    return levels;    
};


const addLine = async (text,language,script,book, bookContext, user) => {
    const db = await getDb();
    const lines = db.collection('lines');
    const line = await lines.findOne({ text, language });
    const context = convertToContextLevels(bookContext);
    if(!user) {
        throw(new Error('User not found'));
    }
    if(!line) {
        await lines.insertOne({
            text,
            language,
            script,
            book,
            bookContext,
            sequence: extractSequence(bookContext),
            context,
            createdBy: user.id,
            createdAt: new Date(),
            approved: false
        });
        return lines.findOne({text});
    }
    return line;
};

async function handler(req, res) {
    try {
        if (req.method === 'POST') {
            const session = await getSession({ req });
            if(session) {
                const { user} = session;
                const { text, language, script, book, bookContext } = req.body;
                const line = await addLine(text,language,script,book, bookContext, user);
                return res.json(line);
            } else {
                return res.status(401).send('Not Authenticated');
            }
        } else if (req.method === 'PUT') {
            const session = await getSession({ req });
            if(session) {
                const { user } = session;
                const { id, translation = '', text= '' } = req.body;
                if(translation != '') {
                    const updateObject = {
                        id,
                        translation
                    };
                    const line = await updateLine(updateObject, user);
                    return res.json(line);
                } else if(text != '') {
                    const updateObject = {
                        id,
                        text
                    };
                    console.log('attempting to update text:  user authorization', user.authorised);                    
                    if(user.authorised) {
                        const line = await updateLineText(updateObject);
                        return res.json(line);    
                    }
                }                
            } else {
                return res.status(401).send('Not Authenticated');
            }
        } 
        
    } catch(e) {
        res.status(500).send(e.message);
    }    
}

export default corsWrapper(handler);
