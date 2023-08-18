const express = require('express');
const router = express.Router();
const Thought = require('../db/models/Thought');
const User = require('../db/models/User');

// GET to get all thoughts
router.get('/', async (req, res) => {
	try {
		const thoughts = await Thought.find();
		res.json(thoughts);
	} catch (err) {
		res.status(500).json(err);
	}
});

// GET to get a single thought by its _id
router.get('/:id', async (req, res) => {
	try {
		const thought = await Thought.findById(req.params.id);
		if (!thought) {
			return res
				.status(404)
				.json({ message: 'No thought found with this ID!' });
		}
		res.json(thought);
	} catch (err) {
		res.status(500).json(err);
	}
});

// POST to create a new thought
router.post('/', async (req, res) => {
	try {
		const newThought = new Thought({
			thoughtText: req.body.thoughtText,
			username: req.body.username,
		});

		const savedThought = await newThought.save();

		await User.findByIdAndUpdate(
			req.body.userId,
			{ $push: { thoughts: savedThought._id } },
			{ new: true }
		);

		res.json(savedThought);
	} catch (err) {
		res.status(500).json(err);
	}
});

// PUT to update a thought by its _id
router.put('/:id', async (req, res) => {
	try {
		const updatedThought = await Thought.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);
		if (!updatedThought) {
			return res
				.status(404)
				.json({ message: 'No thought found with this ID!' });
		}
		res.json(updatedThought);
	} catch (err) {
		res.status(500).json(err);
	}
});

// DELETE to remove a thought by its _id
router.delete('/:id', async (req, res) => {
	try {
		const thought = await Thought.findById(req.params.id);
		if (!thought) {
			return res
				.status(404)
				.json({ message: 'No thought found with this ID!' });
		}
		await Thought.findByIdAndDelete(req.params.id);
		res.json({ message: 'Thought deleted!' });
	} catch (err) {
		res.status(500).json(err);
	}
});

// POST to create a reaction
router.post('/:thoughtId/reactions', async (req, res) => {
	try {
		const updatedThought = await Thought.findByIdAndUpdate(
			req.params.thoughtId,
			{ $push: { reactions: req.body } },
			{ new: true, runValidators: true }
		);
		res.json(updatedThought);
	} catch (err) {
		res.status(500).json(err);
	}
});

// DELETE to remove a reaction
router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
	try {
		const updatedThought = await Thought.findByIdAndUpdate(
			req.params.thoughtId,
			{ $pull: { reactions: { reactionId: req.params.reactionId } } },
			{ new: true }
		);
		res.json(updatedThought);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
