import { ObjectId } from 'mongodb';
import getDb from '../../../mongo';

export const getWordByText = async (text) => {
    const db = await getDb();
    const agg = [
        {
            '$match': {
                text
            }
        },
        {
          '$lookup': {
            'from': 'users', 
            'localField': 'createdBy', 
            'foreignField': 'id', 
            'as': 'user'
          }
        },
        {
            '$project': {
                'locations.createdBy': 0,
                'locations.createdAt': 0,
                'createdBy': 0,
                'createdAt': 0,
                'user._id': 0,
                'user.email': 0
            }
        },
        {
            '$unwind': {
                path: '$user'
            }
        },
        {
            '$unwind': {
                path: '$locations'
            }
        }
    ];
    const translations = await db.collection('words').aggregate(agg).toArray();
    return { translations } ;
}



export const getWordById = async (id) => {
    const db = await getDb();
    const agg = [
        {
            '$match': {
                _id: ObjectId(id)
            }
        },
        {
          '$lookup': {
            'from': 'users', 
            'localField': 'createdBy', 
            'foreignField': 'id', 
            'as': 'user'
          }
        },
        {
            '$project': {
                'locations.createdBy': 0,
                'locations.createdAt': 0,
                'createdBy': 0,
                'createdAt': 0,
                'user._id': 0,
                'user.email': 0
            }
        },
        {
            '$unwind': {
                path: '$user'
            }
        },
        {
            '$unwind': {
                path: '$locations'
            }
        }
    ];
    const translations = await db.collection('words').aggregate(agg).toArray();
    return { translations } ;
}

export const deleteTranslationForLocation = async (wordId, book, bookContext) => {
    const db = await getDb();
    const words = db.collection('words');
    await words.updateOne({_id: ObjectId(wordId)}, {
        $pull: {
            locations: {
                book,
                bookContext
            }
        }
    });
    const word = await words.findOne({_id: ObjectId(wordId)});
    if(word.locations.length === 0) {
        await words.deleteOne({_id: ObjectId(wordId)});
    }
};