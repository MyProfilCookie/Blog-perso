require("dotenv").config();
const mongoose = require("mongoose");

async function DBConnectionHandler() {
    try {
        await mongoose.connect(process.env.DB_STRING);
        console.log("Votre base de données est connectée");
    } catch (err) {
        console.log(`Il y a eu une erreur lors de la connection DB: ${err.message}`);
        process.exit(1);
    }
}

module.exports = DBConnectionHandler;