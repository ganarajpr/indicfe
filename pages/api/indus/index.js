import corsWrapper from "../../../lib/corsWrapper";
import content from './indus.json';
import seals from './valid.json';


const getSymbolsToGlyph = () => {
    const symbols = {};
    Object.keys(content).forEach(key => {
        symbols[key] = content[key][0].glyph;
    });
    return symbols;
};

const getSeals = () => {
    const sealSymbols = seals.map(seal => {
        return seal.text ? seal.text
            .replace(/\+/g, '')
            .split('-') : [];
    });
    const symbols = getSymbolsToGlyph();
    const finalSeals = sealSymbols.map(seal => {
        return seal.map(symbol => {
            return symbols[+symbol];
        });
    });
    return finalSeals;
};

async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            const seals = getSeals();
            return res.json({seals});
        }
        return res.status(404).send('NOT FOUND');
    } catch(e) {
        res.status(500).send(e.message);
    }    
}

export default corsWrapper(handler);
