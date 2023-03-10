import mongoose from "mongoose";

const user = new mongoose.Schema({
	userId: {
		type: String,
		required: true,
		unique: true,
	},
	commandsExecuted: {
		type: Number,
		required: true,
	},
	conversationWithMusashi: {
		type: Number,
		required: true,
	},
	blacklisted: {
		type: Boolean,
	},
	lastVoteTimestamp: {
		type: Number,
	},
});

export = mongoose.model("user", user);
