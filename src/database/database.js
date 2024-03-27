//---database.js---//

//Middleware Mongoose
const mongoose = require('mongoose');

//Database MongoDB App Connection 
const db_App = async () => { //Async Function for Connection using await and try/catch for Error Handling
    try {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true }); //Wait until connection to mongodb app URI is successsful   
        console.log('Conexão com o Banco de dados feita com sucesso!');           //if there are no errors it will print on the console: successfully connected

        const dbName = mongoose.connection.db.namespace;
        console.log('DB: ', dbName);

    } catch (err) {
        console.log('Error: ', err);  //if not it will return an error in the console to be handled
    }
}

//Export the Database Connection
module.exports = db_App;




