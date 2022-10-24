const admin = require("firebase-admin");

const serviceKey = require("../sumit-63805-firebase-adminsdk-brgc6-b06267b25e.json");

const app = admin.initializeApp(
    {
        credential: admin.credential.cert(serviceKey)
    }
);

const db = app.firestore();


module.exports = db;

