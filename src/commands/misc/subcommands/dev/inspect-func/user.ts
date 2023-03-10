import User from "../../../../../schemas/User";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

export = async (interaction: ChatInputCommandInteraction) => 
{
	if (!interaction.isChatInputCommand()) return;

	const user = interaction.options.getUser("user") || interaction.user;
	const userDB = await User.findOne({ userId: user.id, });

	const infoEmbed: EmbedBuilder = new EmbedBuilder()
		.setColor("#2f3136")
		.setTitle(`${user.username}'s Info`)
		.setDescription(
			`User ID: **${userDB.userId}**\n` +
				`Blacklisted: **${userDB.blacklisted || false}**\n` +
				`Commands Executed: **${userDB.commandsExecuted}**\n` +
				`Conversations with Musashi: **${userDB.conversationWithMusashi}**`
		);

	await interaction.editReply({ embeds: [infoEmbed], });
};
