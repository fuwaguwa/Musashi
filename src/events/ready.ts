import { Event } from "../structures/Event";
import fetch from "node-fetch";

export default new Event("ready", () => 
{
	console.log("Musashi is ready!");

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
