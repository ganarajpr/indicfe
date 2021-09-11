import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import getDb from '../../../mongo';
import { MongoDBAdapter } from "../../../mongo/adapters";
import { ObjectId } from 'mongodb';

export default async (req, res) => {
    const db = await getDb();
    const options = {
        providers: [
            Providers.Google({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET
            }),
        ],
        debug: false,
        adapter: MongoDBAdapter({
            db: () => db,
            ObjectId: ObjectId
        })
    };
    return NextAuth(req, res, options);
}