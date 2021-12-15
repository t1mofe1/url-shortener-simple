const express = require('express');
const app = express();

const { db, storage } = require('./firebase');

app.use(express.static('public'));
app.use(express.json());

app.set('trust proxy', true);

// STATIC
app.use(express.static('public'));

// INDEX
app.get('/', (_, res) => res.sendFile(__dirname + '/index.html'));

// SHORTS REDIRECT
app.get('/:id', async (req, res) => {
	const { id } = req.params;

	const shortQuerySnapshot = await db.shorts.where('id', '==', id).get();

	if (shortQuerySnapshot.empty) {
		return res.status(404).send('Short not found');
	}

	const short = shortQuerySnapshot.docs[0].data();

	if (short.disabled) {
		return res.status(403).send('Short is not currently available');
	}

	shortQuerySnapshot.docs[0].ref.update({
		visited: db.FieldValue.increment(1),
	});

	res.redirect(short.url);
});

// API
app.use('/api/shorts', require('./api/shorts'));

app.listen(80, () => console.log('Listening on port 80'));
