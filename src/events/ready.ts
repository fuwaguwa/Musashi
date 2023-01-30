import { Event } from "../structures/Event";
import fetch from "node-fetch";
import { client } from "..";
import { ActivityType } from "discord.js";

export default new Event("ready", () => 
{
	console.log("Musashi is ready!");
	client.user.setActivity({
		name: "shikikans' needs",
		type: ActivityType.Listening,
	});

	fetch(
		`https://api-inference.huggingface.co/models/Fuwaguwa/DialoGPT-Medium-AzurLaneMusashi-v${process.env.version}`,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${process.env.huggingfaceApiKey}`,
			},
			body: JSON.stringify({ inputs: "initialize", }),
		}
	);
});
