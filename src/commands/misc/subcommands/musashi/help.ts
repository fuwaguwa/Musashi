import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

export = async (interaction: ChatInputCommandInteraction) => 
{
	const help: EmbedBuilder = new EmbedBuilder()
		.setColor("#2f3136")
		.setTitle("How to setup Musashi to chat with her")
		.setDescription(
			`1. Create a channel dedicated to chatting with her\n` +
				`2. Run \`/set-chat-channel\` and pick the channel you have created.\n` +
				`3. You can now talk with Mushashi in the channel!`
		);

	await interaction.reply({ embeds: [help], });
};
