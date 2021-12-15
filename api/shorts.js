const express = require('express');

const app = express.Router();

const { nanoid } = require('nanoid');

const { db, storage } = require('../firebase');

const { isWebUri: validateURL } = require('valid-url');

async function generateShortID() {
	let id = nanoid(10);

	const exists = await db.shorts
		.where('id', '==', id)
		.get()
		.then((r) => r.exists);

	return exists ? await generateShortID() : id;
}

// GET /api/shorts
app.get('/', async (req, res) => {
	const shorts = await db.shorts.get().then((snapshot) => snapshot.docs.map((short) => short.data()));

	res.send(shorts);
});

// GET /api/shorts/:id
app.get('/:id', async (req, res) => {
	const { id } = req.params;

	const shortQuerySnapshot = await db.shorts.where('id', '==', id).get();

	if (shortQuerySnapshot.empty) {
		return res.status(404).send({ error: 'Short not found' });
	}

	const short = shortQuerySnapshot.docs[0].data();

	if (short.disabled) {
		return res.status(403).send({ error: 'Short is not currently available' });
	}

	res.send(short);
});

// POST /api/shorts
app.post('/', async (req, res) => {
	const { url } = req.body;

	if (!validateURL(url)) {
		return res.status(400).send({ error: 'Invalid URL' });
	}

	// TODO: if url is already in db, return that instead of creating a new one

	const id = await generateShortID();

	const short = await db.shorts.add({
		id,
		url,
		visited: 0,
	});

	res.send(id);
});

// TODO: DELETE /api/shorts/:id

module.exports = app;
