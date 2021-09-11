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
exports.format = {
    /** Takes a mongoDB object and returns a plain old JavaScript object */
    from(object) {
        const newObject = {};
        for (const key in object) {
            const value = object[key];
            if (key === "_id") {
                newObject.id = value.toHexString();
            }
            else {
                newObject[key] = value;
            }
        }
        return newObject;
    },
};
function MongoDBAdapter(options) {
    const { db, ObjectId } = options;
    const m = db();
    const { from } = exports.format;
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
            console.log(data, 'creating user');
            const { id, ...rest } = data;
            const user = { userId:id, ...rest };
            await Users.insertOne(user);
            return from(user);
        };
        const getUser = async (id) => {
            console.log(id, 'getting user');
            const user = await Users.findOne({ userId: id });
            if (!user)
                return null;
            return from(user);
        };
        const getUserByEmail = async (email) => {
            console.log(email, 'getting user by email');
            const user = await Users.findOne({ email });
            if (!user)
                return null;
            return from(user);
        };
        const getUserByProviderAccountId = async (providerId, providerAccountId) => {
            console.log(providerId,providerAccountId, 'getting user by account id');
            const account = await Accounts.findOne({accountId: providerAccountId });
            if (account) {
                const user = await getUser(providerAccountId);
                console.log('return user', user)
                if (!user)
                    return null;
                return from(user);
            }
            return null;                
        };
        async function updateUser(data) {
            console.log('updating user', data);
            const { value: user } = await Users.findOneAndUpdate({ _id: _id(data.id) }, { $set: data });
            return from(user);
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
            console.log('linking account', accountId,
            providerId,
            providerType,
            providerAccountId,
            refreshToken,
            accessToken,
            accessTokenExpires);
            const account = { userId: providerAccountId, accountId , providerId, accessToken };
            await Accounts.insertOne(account);
            return from(account);
        }
        async function unlinkAccount(provider_providerAccountId) {
            const { value: account } = await Accounts.findOneAndDelete(provider_providerAccountId);
            return from(account);
        }
        async function getSession(sessionToken) {
            console.log('getting session and token ', sessionToken);
            const session = await Sessions.findOne({
                sessionToken
            });
            if (!session)
                return null;
            const user = await getUser(session.userId);
            console.log('found user with session user id', user);
            if (!user)
                return null;
            return from(session);
        }
        async function createSession(data) {
            const {id, ...rest } = data;
            const account = await Accounts.findOne({accountId: id });
            if(account) {
                const session = { ...rest, accountId: id, sessionToken: uuidv4(), accessToken: account.accessToken };
                await Sessions.insertOne(session);
                return from(session);    
            }
            return null;
        }
        async function updateSession(data) {
            console.log('updateing session', data);
            const { value: session } = await Sessions.findOneAndUpdate({ sessionToken: data.sessionToken }, { $set: data });
            return from(session);
        }
        async function deleteSession(sessionToken) {
            const { value: session } = await Sessions.findOneAndDelete({
                sessionToken,
            });
            return from(session);
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
