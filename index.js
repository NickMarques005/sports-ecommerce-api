//---index.js---//

const dotenv = require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET);

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
const port = process.env.PORT || 3000;

const database = require("./src/database/database");
const getCollection = require("./src/database/mongo_connection");
const MainRouter = require('./src/routes/main_router');
const StripeRouter = require('./src/routes/stripe_route');

//Importing Database to index.js
database();

const corsOptions = {
    origin: ['http://localhost:3001', "https://sports-ecommerce-app.onrender.com", "https://sports-ecommerce-mern-app-frontend.vercel.app", ]
};

app.use(cors(corsOptions));

//App GET METHOD
app.get('/', (req, res) => {
    res.send('Sports E-Commerce API Server');    //Send message reply to Frontend
});

app.use('/api/stripe', StripeRouter);

app.use(express.json());

app.use('/api', MainRouter);

//App listening Function
app.listen(port, () => {
    console.log(`App Server listening on port ${port}`); 
});


