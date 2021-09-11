import { MongoClient } from "mongodb";
let client;
let db;
const getDb = async () => {
    if(!client) {
        client = new MongoClient(process.env.MONGOURL);
        await client.connect();
        db = client.db(process.env.DB_NAME);
    }
    return db;    
}; 
export default getDb;