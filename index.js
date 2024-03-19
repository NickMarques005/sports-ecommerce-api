//---index.js---//

//Dotenv
const dotenv = require('dotenv').config();

//Middleware Express / Cors 
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
//Port Number for the server
const port = process.env.PORT || 3000;
//Requiring Database Functionalitys
const database = require("./server/database");
const getCollection = require("./server/mongo_connection");
//Importing Database to index.js
database();

const corsOptions = {
    origin: ['http://localhost:3000', "https://sports-ecommerce-app.onrender.com", "https://sports-ecommerce-mern-app-frontend.vercel.app" ]
};

app.use(cors(corsOptions));

//App GET METHOD
app.get('/', (req, res) => {
    res.send('Sports E-Commerce API Server');    //Send message reply to Frontend
});

app.use(express.json());

//app.use('/api/userdata', require('./routes/authData'));

app.use('/api/', require("./server/routes/createUser"));

app.use('/api/', require("./server/routes/displayData"));

app.use('/api/', require("./server/routes/authData"));

app.post('/api/updateAllProducts', async (req, res) => {
    try {
        const collection = await getCollection(); 

        const updateResult = await collection.updateMany({}, { $set: { subcategory: "" } });

        res.json({ message: `${updateResult.modifiedCount} updated documents` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating documents..' });
    }
});

//App listening Function
app.listen(port, () => {
    console.log(`App Server listening on port ${port}`); //Prints on the console that the app server is listening on the desired port
});

