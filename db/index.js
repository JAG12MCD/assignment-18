require('dotenv').config();
const mongoose = require('mongoose');

const dbUrl = process.env.DB_URL;
const dbName = process.env.DB_NAME;

if (!dbUrl || !dbName) {
	console.log(
		'Database url or database name not found. Please do appropriate changes in .env file'
	);
}

const MONGO_URI = `${dbUrl}/${dbName}`;

async function connect() {
	try {
		await mongoose.connect(MONGO_URI);
		console.log('Successfully connected to MongoDB');
	} catch (error) {
		console.error('Error connecting to MongoDB', error);
	}
}

module.exports = connect;
