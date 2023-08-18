require('dotenv').config();
const express = require('express');
const connectDB = require('./db/index');
const userRouter = require('./routes/users');
const thoughtRouter = require('./routes/thoughts');

const app = express();
const PORT = process.env.SERVER_PORT || 80; // replace with your desired port number

// Connect to MongoDB using Mongoose
app.use(express.json());
app.use('/api/users', userRouter);
app.use('/api/thoughts', thoughtRouter);

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.listen(PORT, () => {
	connectDB().then(() => {
		console.log(`Server is running on http://localhost:${PORT}`);
	});
});
