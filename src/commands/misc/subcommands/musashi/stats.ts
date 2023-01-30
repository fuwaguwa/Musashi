import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { client } from "../../../..";

export = async (interaction: ChatInputCommandInteraction) => 
{
	if (!interaction.deferred) await interaction.deferReply();

	/**
	 * Uptime
	 */
	let totalSeconds = client.uptime / 1000;
	totalSeconds %= 86400;

	let hours = Math.floor(totalSeconds / 3600);
	totalSeconds %= 3600;

	let minutes = Math.floor(totalSeconds / 60);
	let seconds = Math.floor(totalSeconds % 60);

	/**
	 * Output
	 */
	// Outputting Data
	const performance: EmbedBuilder = new EmbedBuilder()
		.setColor("#2f3136")
		.setTitle("Musashi's Stats")
		.addFields(
			{
				name: "Uptime:",
				value: `${hours} hours, ${minutes} minutes, ${seconds} seconds`,
			},
			{
				name: "Bot Stats:",
				value: `Total Guilds: **${client.guilds.cache.size}**`,
			}
		);
	await interaction.editReply({ embeds: [performance], });
};
