const Firebase = require('firebase-admin');

const firebase = Firebase.initializeApp({
	credential: Firebase.credential.cert(require('./firebase-credentials.json')),
});

const db = firebase.firestore();
// db.users = db.collection('users');
db.shorts = db.collection('shorts');
db.FieldValue = Firebase.firestore.FieldValue;

const storage = firebase.storage();

module.exports = { db, storage };
