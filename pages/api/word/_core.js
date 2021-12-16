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
                path: '$user',
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            '$unwind': {
                path: '$locations',
                "preserveNullAndEmptyArrays": true
            }
        }
    ];
    const translations = await db.collection('words').aggregate(agg).toArray();
    return { translations } ;
}


const getInflections = (textArr) => {
    return textArr.map( text => inflectPhrase(text) );
};


export const getWordforAllText = async (textArray) => {
    console.log(textArray);
    const infArray = getInflections(textArray);
    console.log(infArray);
    const db = await getDb();
    const agg = [
        {
            '$match': {
                text: {$in: infArray}
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
                path: '$user',
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            '$unwind': {
                path: '$locations',
                "preserveNullAndEmptyArrays": true
            }
        }
    ];
    const translations = await db.collection('wordshk').aggregate(agg).toArray();
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
                path: '$user',
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            '$unwind': {
                path: '$locations',
                "preserveNullAndEmptyArrays": true
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

export const downVoteLocation = async (wordId, book, bookContext, userId) => {
    const db = await getDb();
    const words = db.collection('words');
    await words.updateOne(
        {_id: ObjectId(wordId), "locations.book": book, "locations.bookContext": bookContext },
        {
            $pull: { "locations.$.like": userId },
            $inc: { "locations.$.votes": -1 }
        }
    );
};
