import { Guild, VoiceChannel } from "discord.js";
import { client } from "..";

/**
 * Update server count on bot listings
 */
export async function updateServerCount() 
{
	if (client.user.id === "1002189046619045908") return "Not Main Bot";

	// On Logging Server
	const guild: Guild = await client.guilds.fetch("1002188088942022807");
	const channel = (await guild.channels.fetch(
		"1069502866999484456"
	)) as VoiceChannel;

	channel.setName(`Server Count: ${client.guilds.cache.size}`);
}
