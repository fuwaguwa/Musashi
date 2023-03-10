import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

export = async (interaction: ChatInputCommandInteraction) => 
{
	const help: EmbedBuilder = new EmbedBuilder()
		.setColor("#2f3136")
		.setTitle("How To Setup Musashi")
		.setDescription(
			`1. Create a channel dedicated to chatting with her. It is recommended that you disable all other bots and commands in the channel for the best exprience as well as **add at least 5 seconds of slowmode to the channel to avoid spamming**!\n\n` +
				`2. Run \`/set-chat-channel\` and pick the channel you have created.\n\n` +
				`3. You can now talk with Mushashi in the channel! It is also recommended that you form intelligible sentences for the best results!`
		)
		.setFooter({
			text: "Musashi has a 4s cooldown after every message for each guild",
		});

	await interaction.reply({ embeds: [help], });
};
