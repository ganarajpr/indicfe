import getDb from '../../../mongo';
import { clamp } from 'lodash-es';
import { deleteTranslationForLocation } from '../word/_core';
import { ObjectId } from 'bson';

export const getVoteOnTranslationLocation = async (translationId, book, bookContext, userId) => {
    const db = await getDb();
    const vote = await db.collection('votes').findOne({ translationId, book, bookContext, userId});
    return vote;
}

export const addVoteOnTranslationLocation = async (translationId, book, bookContext, userId, value) => {
    const db = await getDb();
    const vote = await getVoteOnTranslationLocation(translationId, book, bookContext, userId);
    const clampedValue = clamp(value,-1, 1);
    if(!vote) {
        const insertedVote = await db.collection('votes').insertOne({ translationId, book, bookContext, userId, value: clampedValue});
        return insertedVote;
    } else {
        const insertedVote = await db.collection('votes').updateOne({ translationId, book, bookContext, userId}, {
            $set: {
                value: clampedValue
            }
        });
        return insertedVote;
    }
}


export const countVotes = async (translationId, book, bookContext) => {
    const db = await getDb();
    const agg  = [
        {
            '$match': {
                translationId: ObjectId(translationId),
                book,
                bookContext
            }
        },
        {
          '$group': {
                '_id': {
                    'book': '$book', 
                    'bookContext': '$bookContext'
                }, 
                'totalVote': {
                    '$sum': '$value'
                }
            }
        }
    ];
    const [{totalVote}] = await db.collection('votes').aggregate(agg).toArray();
    return totalVote;
};

export const removeVoteOnTranslationLocation = async (translationId, book, bookContext, userId) => {
    const db = await getDb();
    const totalVote = await countVotes(translationId, book, bookContext);    
    await db.collection('votes').deleteOne({ translationId: ObjectId(translationId), book, bookContext, userId});
    if(totalVote <= 0) {
        await deleteTranslationForLocation(translationId, book, bookContext);
    }
}