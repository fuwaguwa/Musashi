import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

export = async (interaction: ChatInputCommandInteraction) => 
{
	const help: EmbedBuilder = new EmbedBuilder()
		.setColor("#2f3136")
		.setTitle("How To Setup Musashi")
		.setDescription(
			`1. Create a channel dedicated to chatting with her. It is recommended that you disable all other bots and commands in the channel for the best exprience!\n\n` +
				`2. Run \`/set-chat-channel\` and pick the channel you have created.\n\n` +
				`3. You can now talk with Mushashi in the channel! It is also recommended form intelligible sentences for the best results!`
		);

	await interaction.reply({ embeds: [help], });
};
