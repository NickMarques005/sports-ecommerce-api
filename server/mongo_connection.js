const MongoClient = require('mongodb').MongoClient;

const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function database_connection() {
    try {
        await client.connect();
        console.log("Connected successfully to DB!");

        const db = client.db("storepage_Sports_db");

        const collection = db.collection("products_data"); 

        return collection;
    } catch (err) {
        console.error("Error connecting to DB:", err);
    }
}

module.exports = database_connection;