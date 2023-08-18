const express = require('express');
const router = express.Router();
const User = require('../db/models/User');
const Thought = require('../db/models/Thought');

// GET all users
router.get('/', async (req, res) => {
	try {
		const users = await User.find()
			.populate('thoughts')
			.populate('friends');
		res.json(users);
	} catch (err) {
		res.status(500).json(err);
	}
});

// GET a single user by its _id and populated thought and friend data
router.get('/:id', async (req, res) => {
	try {
		const user = await User.findById(req.params.id)
			.populate('thoughts')
			.populate('friends');
		if (!user) {
			return res
				.status(404)
				.json({ message: 'No user found with this ID!' });
		}
		res.json(user);
	} catch (err) {
		res.status(500).json(err);
	}
});

// POST a new user
router.post('/', async (req, res) => {
	try {
		const newUser = new User(req.body);
		await newUser.save();
		res.json(newUser);
	} catch (err) {
		res.status(400).json(err);
	}
});

// PUT to update a user by its _id
router.put('/:id', async (req, res) => {
	try {
		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true, runValidators: true }
		);

		if (!updatedUser) {
			return res
				.status(404)
				.json({ message: 'No user found with this ID!' });
		}

		res.json(updatedUser);
	} catch (err) {
		res.status(400).json(err);
	}
});

// DELETE to remove user by its _id
router.delete('/:id', async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		if (!user) {
			return res
				.status(404)
				.json({ message: 'No user found with this ID!' });
		}

		// BONUS: Remove a user's associated thoughts when deleted.
		await Thought.deleteMany({ username: user.username });

		await User.findByIdAndDelete(req.params.id);

		return res.json({ message: 'User and associated thoughts deleted!' });
	} catch (err) {
		res.status(400).json(err);
	}
});

// POST to add a new friend to a user's friend list
router.post('/:userId/friends/:friendId', async (req, res) => {
	try {
		// Add the friend's ID to the user's friends list
		const user = await User.findByIdAndUpdate(
			req.params.userId,
			{ $addToSet: { friends: req.params.friendId } },
			{ new: true }
		).populate('friends');

		if (!user) {
			return res
				.status(404)
				.json({ message: 'No user found with this ID!' });
		}

		res.json(user);
	} catch (err) {
		res.status(500).json(err);
	}
});

// DELETE to remove a friend from a user's friend list
router.delete('/:userId/friends/:friendId', async (req, res) => {
	try {
		// Remove the friend's ID from the user's friends list
		const user = await User.findByIdAndUpdate(
			req.params.userId,
			{ $pull: { friends: req.params.friendId } },
			{ new: true }
		).populate('friends');

		if (!user) {
			return res
				.status(404)
				.json({ message: 'No user found with this ID!' });
		}

		res.json(user);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
