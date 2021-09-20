"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDBAdapter = exports.format = exports.collections = void 0;
const { v4:uuidv4 } = require('uuid');
exports.collections = {
    Users: "users",
    Accounts: "accounts",
    Sessions: "sessions",
    VerificationTokens: "verification_tokens",
};

function MongoDBAdapter(options) {
    const { db, ObjectId } = options;
    const m = db();
    const sessionMaxAge = 60*60*1000;
    const sessionUpdateAge = 0.9*60*60*1000;
    // Converts from string to ObjectId
    const _id = (hex) => {
        if ((hex === null || hex === void 0 ? void 0 : hex.length) !== 24)
            return ObjectId();
        return ObjectId(hex);
    };
    const { Users, Accounts, Sessions, VerificationTokens } = {
        Users: m.collection(exports.collections.Users),
        Accounts: m.collection(exports.collections.Accounts),
        Sessions: m.collection(exports.collections.Sessions),
        VerificationTokens: m.collection(exports.collections.VerificationTokens),
    };

    const getAdapter = async () => {

        const createUser = async (data) => {
            const { id, ...rest } = data;
            const user = { id:id, ...rest };
            await Users.insertOne(user);
            return user;
        };
        const getUser = async (id) => {
            const user = await Users.findOne({ id: id });
            if (!user)
                return null;
            return user;
        };
        const getUserByEmail = async (email) => {
            const user = await Users.findOne({ email });
            if (!user)
                return null;
            return user;
        };
        const getUserByProviderAccountId = async (providerId, providerAccountId) => {
            const account = await Accounts.findOne({id: providerAccountId });
            if (account) {
                const user = await getUser(providerAccountId);
                if (!user)
                    return null;
                return user;
            }
            return null;                
        };
        async function updateUser(data) {
            const { value: user } = await Users.findOneAndUpdate({ _id: _id(data.id) }, { $set: data });
            return user;
        }
        async function deleteUser(id) {
            await Promise.all([
                m.collection(exports.collections.Accounts).deleteMany({ userId: _id(id) }),
                m.collection(exports.collections.Sessions).deleteMany({ userId: _id(id) }),
                m.collection(exports.collections.Users).deleteOne({ _id: _id(id) }),
            ]);
        }
        const linkAccount = async ( accountId,
            providerId,
            providerType,
            providerAccountId,
            refreshToken,
            accessToken,
            accessTokenExpires) => {
            const account = { userId: providerAccountId, id:accountId , providerId, accessToken };
            await Accounts.insertOne(account);
            return account;
        }
        async function unlinkAccount(provider_providerAccountId) {
            const { value: account } = await Accounts.findOneAndDelete({ id:provider_providerAccountId});
            return account;
        }
        async function getSession(sessionToken) {
            const session = await Sessions.findOne({
                sessionToken
            });
            if (!session)
                return null;            
            // Check session has not expired (do not return it if it has)
            if (session?.expires && new Date() > new Date(session.expires)) {
                await Sessions.deleteOne({sessionToken});
                return null;
            }
            return session;
        }
        async function createSession(data) {
            const {id, ...rest } = data;
            const existingSession = await Sessions.findOne({userId: id});
            if(existingSession) {
                await Sessions.deleteOne({userId: id});
            }
            let expires = null
            if (sessionMaxAge) {
                const dateExpires = new Date()
                dateExpires.setTime(dateExpires.getTime() + sessionMaxAge)
                expires = dateExpires.toISOString()
            }
            const session = { ...rest, userId: id, sessionUserId: id, sessionToken: uuidv4(), expires };
            await Sessions.insertOne(session);
            return session;            
        }
        async function updateSession(data) {
            const { id, ...rest } = data;
            const { value: session } = await Sessions.findOneAndUpdate({ sessionToken: data.sessionToken }, { $set: rest });
            return session;
        }
        async function deleteSession(sessionToken) {
            const { value: session } = await Sessions.findOneAndDelete({
                sessionToken,
            });
            return session;
        }
        async function createVerificationToken(data) {
            const token = { ...data };
            await VerificationTokens.insertOne(token);
            return data;
        }
        async function useVerificationToken(identifier_token) {
            const { value: verificationToken } = await VerificationTokens.findOneAndDelete(identifier_token);
            if (!verificationToken)
                return null;
            // @ts-expect-error
            delete verificationToken._id;
            return verificationToken;
        }
        return {
            createUser,  
            getUser,
            getUserByEmail,
            getUserByProviderAccountId,
            updateUser,
            useVerificationToken,
            createVerificationToken,
            deleteSession,
            updateSession,
            createSession,
            getSession,
            unlinkAccount,
            linkAccount,
            deleteUser
        };
    };
    return { getAdapter };
}
exports.MongoDBAdapter = MongoDBAdapter;
