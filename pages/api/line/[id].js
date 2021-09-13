import getDb from "../../../mongo";
import corsWrapper from "../../../lib/corsWrapper";
import { ObjectId } from 'mongodb';

const getLine = async (id) => {
    const db = await getDb();
    return db.collection('lines').findOne(
            {_id:ObjectId(id)},
            { projection: {createdBy: 0, createdAt: 0, _id: 0} }
        );
}

async function handler(req, res) {
    if (req.method === 'GET') {
        const { id } = req.query;
        console.log('handler line id', id);
        const line = await getLine(id);
        return res.json(line);
    }
}

export default corsWrapper(handler);