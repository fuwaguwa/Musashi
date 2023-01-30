import {
	ApplicationCommandOptionType,
	ChannelType,
	EmbedBuilder,
	TextChannel
} from "discord.js";
import { ChatInputCommand } from "../../structures/Command";
import Guild from "../../schemas/Guild";

export default new ChatInputCommand({
	name: "set-chat-channel",
	description: "Set the channel to chat with musashi",
	cooldown: 5000,
	options: [
		{
			type: ApplicationCommandOptionType.Channel,
			channelTypes: [ChannelType.GuildText],
			name: "channel",
			description: "The channel you want to use to chat with Musashi.",
		}
	],
	run: async ({ interaction, }) => 
	{
		if (!interaction.deferred) await interaction.deferReply();

		/**
		 * Perm Check
		 */
		const guildUserPerms = (
			await interaction.guild.members.fetch(interaction.user)
		).permissions;

		if (
			!guildUserPerms.has("Administrator") &&
			!guildUserPerms.has("ManageChannels")
		) 
		{
			const noPerm: EmbedBuilder = new EmbedBuilder()
				.setColor("Red")
				.setDescription(
					"❌ | You need `Manage Channels` permission to use this command!"
				);
			return interaction.editReply({ embeds: [noPerm], });
		}
		const channel = interaction.options.getChannel("channel") as TextChannel;

		if (
			!interaction.guild.members.me
				.permissionsIn(channel as TextChannel)
				.has("SendMessages")
		) 
		{
			const noPerm: EmbedBuilder = new EmbedBuilder()
				.setColor("Red")
				.setDescription(
					"❌ | Musashi does not have permission to send message in this channel"
				);
			return interaction.reply({ embeds: [noPerm], });
		}

		/**
		 * Setting the channel
		 */
		const dbGuild = await Guild.findOne({ guildId: interaction.guild.id, });
		dbGuild
			? await dbGuild.updateOne({ chatChannelId: channel.id, })
			: await Guild.create({
				guildId: interaction.guild.id,
				chatChannelId: channel.id,
			  });

		const done: EmbedBuilder = new EmbedBuilder()
			.setColor("Green")
			.setDescription(`✅ | You can now talk with me in <#${channel.id}>!`);
		await interaction.editReply({ embeds: [done], });
	},
});
