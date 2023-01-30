import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	Guild,
	TextChannel
} from "discord.js";
import { client } from "..";
import { Event } from "../structures/Event";

export default new Event("guildCreate", async (guild) => 
{
	await guild
		.fetchAuditLogs({
			type: 28,
			limit: 1,
		})
		.then(async (log) => 
		{
			const logGuild: Guild = await client.guilds.fetch("1002188088942022807");
			const ioChannel: TextChannel = (await logGuild.channels.fetch(
				"1069502766537519135"
			)) as TextChannel;
			const adder = log.entries.first().executor;

			const botAddEmbed: EmbedBuilder = new EmbedBuilder()
				.setColor("Green")
				.setTitle("Musashi joined a server!")
				.setThumbnail(adder.displayAvatarURL({ forceStatic: false, }))
				.setImage(guild.iconURL({ forceStatic: false, }))
				.setFields(
					{
						name: "Guild Name | Guild ID",
						value: `${guild.name} | ${guild.id}`,
					},
					{
						name: "User | User ID",
						value: `${adder.username}#${adder.discriminator} | ${adder.id}`,
					}
				)
				.setTimestamp();
			await ioChannel.send({ embeds: [botAddEmbed], });
		});

	/**
	 * Join message
	 */
	await guild.channels.cache.some((channel) => 
	{
		if (
			channel.name.includes("general") ||
			channel.name.includes("lobby") ||
			channel.name.includes("chat")
		) 
		{
			const helloEmbed: EmbedBuilder = new EmbedBuilder()
				.setColor("#2f3136")
				.setDescription(
					"I am Shinano, a child of the great Sakura Empire!" +
						"You can learn more about what I can do by using `/musashi help`. If you're experiencing any trouble with the bot, please join the support server down below!"
				);
			const supportServer: ActionRowBuilder<ButtonBuilder> =
				new ActionRowBuilder<ButtonBuilder>().addComponents(
					new ButtonBuilder()
						.setStyle(ButtonStyle.Link)
						.setURL("https://discord.gg/NFkMxFeEWr")
						.setLabel("Support Server")
						.setEmoji({ name: "⚙️", }),
					new ButtonBuilder()
						.setStyle(ButtonStyle.Link)
						.setURL(
							"https://discord.com/api/oauth2/authorize?client_id=1069511313832820746&permissions=137439340544&scope=bot%20applications.commands"
						)
						.setLabel("Invite Me!")
						.setEmoji({ name: "👋", })
				);
			(async () =>
				await (channel as TextChannel).send({
					embeds: [helloEmbed],
					components: [supportServer],
				}))();

			return true;
		}
		return false;
	});
});
