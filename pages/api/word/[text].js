import corsWrapper from "../../../lib/corsWrapper";
import { getWordByText } from './_core';

async function handler(req, res) {    
    if (req.method === 'GET') {
        try {            
            const { text } = req.query;
            const word = await getWordByText(text);
            return res.json(word);
        } catch(e) {
            return res.json({});
        }
        
    }
}

export default corsWrapper(handler);