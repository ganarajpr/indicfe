import getDb from "../../../mongo";

export const getWord = async (text) => {
    const db = await getDb();
    return db.collection('words').findOne({text});
}

export const upsertWord = async (text, language, script, createdBy) => {
    const db = await getDb();
    const words = db.collection('words');
    const word = await words.findOne({text});
    if(!word) {
        await words.insertOne({
            text,
            language,
            script,
            createdBy,
            createAt: new Date()
        });
        return words.findOne({text});
    }
    return word;
}