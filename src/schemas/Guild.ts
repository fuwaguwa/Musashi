import mongoose from "mongoose";

const guild = new mongoose.Schema({
	guildId: {
		type: String,
		unique: true,
		required: true,
	},
	chatChannelId: {
		type: String,
		unique: true,
		required: true,
	},
});

export = mongoose.model("guild", guild);
