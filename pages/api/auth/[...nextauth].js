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
        }),
        callbacks : {
            session : async (session, user) => {
                // Send properties to the client, like an access_token from a provider.
                //console.log('session callback', session, user);
                session.user.id = user.id;
                session.user.authorised = !!user.authorised;
                return session
            }
        }
    };
    return NextAuth(req, res, options);
}