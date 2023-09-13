//---database.js---//

//Middleware Mongoose
const mongoose = require('mongoose');

//Database MongoDB App Connection 
const db_App = async () => { //Async Function for Connection using await and try/catch for Error Handling
    try {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true }); //Wait until connection to mongodb app URI is successsful   
        console.log('Connected successfully to DB!');           //if there are no errors it will print on the console: successfully connected

        const dbName = mongoose.connection.db.namespace;
        console.log('DB: ', dbName);

        const fetched_data = await mongoose.connection.db.collection("products_data");

        fetched_data.find({}).toArray()
            .then(async (dataProduct) => {
                const productCategory = await mongoose.connection.db.collection("categoryProducts_data");
                productCategory.find({}).toArray()
                    .then(async (dataCategory) => {
                        const productSuggestions = await mongoose.connection.db.collection("suggestions_data");
                        productSuggestions.find({}).toArray()
                        .then((dataSuggestion)=> {
                                global.products_data = dataProduct;
                                global.categoryProducts_data = dataCategory;
                                global.suggestions_data = dataSuggestion;
                                
                        })
                        .catch((err) => {
                            console.log("Suggestions Data Failed: ", err);
                        })
                    })
                    .catch((err) => {
                        console.log("Category Data Failed: ", err);
                    })

            })
            .catch((err) => {
                console.log('Error:', err);
            });

    } catch (err) {
        console.log('Error: ', err);  //if not it will return an error in the console to be handled
    }
}

//Export the Database Connection
module.exports = db_App;




