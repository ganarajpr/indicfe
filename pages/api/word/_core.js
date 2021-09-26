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
                _id:ObjectId(id)
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
                'createdAt': 0
            }
        }
    ];
    const translations = await db.collection('words').aggregate(agg).toArray();
    return { translations } ;
}