import { Event } from "../structures/Event";
import Guild from "../schemas/Guild";
import User from "../schemas/User";
import { Collection, EmbedBuilder, TextChannel } from "discord.js";
import { client } from "..";
import fetch from "node-fetch";

const Cooldown: Collection<string, number> = new Collection();

export default new Event("messageCreate", async (message) => 
{
	/**
	 * Loading and checking
	 */
	if (!message.member) return;
	if (message.member.user.bot) return;
	if (message.member.id === client.user.id) return;
	if (!message.content) return;

	const member = message.member;
	const dbGuild = await Guild.findOne({ guildId: message.guildId, });
	if (!dbGuild) return;

	const guild = await client.guilds.fetch(dbGuild.guildId);
	const channel = (await guild.channels.fetch(
		dbGuild.chatChannelId
	)) as TextChannel;
	if (message.channelId !== channel.id) return;

	/**
	 * Cooldown
	 */
	if (Cooldown.has(message.guildId)) return;

	/**
	 * Processing
	 */
	message.channel.sendTyping();
	let user = await User.findOne({ userId: message.member.id, });
	if (!user) 
	{
		user = await User.create({
			userId: member.id,
			commandsExecuted: 0,
			conversationWithMusashi: 0,
		});
	}
	if (user.blacklisted) 
	{
		const blacklisted: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setTitle("You have been blacklisted!")
			.setDescription(
				"Please contact us at the [support server](https://discord.gg/NFkMxFeEWr) for more information about your blacklist."
			);
		return message.reply({ embeds: [blacklisted], });
	}

	/**
	 * Responding
	 */
	let EHOSTRetries: number = 0;
	const respond = async () => 
	{
		fetch(
			`https://api-inference.huggingface.co/models/Fuwaguwa/DialoGPT-Medium-AzurLaneMusashi-v${process.env.modelVersion}`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${process.env.huggingfaceApiKey}`,
				},
				body: JSON.stringify({ inputs: message.content, }),
			}
		)
			.then(res => res.json())
			.then(async (json) => 
			{
				if (json.error && json.estimated_time) 
				{
					const loading: EmbedBuilder = new EmbedBuilder()
						.setColor("Red")
						.setDescription(
							"Please wait for the bot to load up the model! The model usually unloads after 3-4m."
						)
						.setFooter({
							text: "Try chatting again after around 30s, that's how long the loading process usually takes!",
						});
					return message.reply({ embeds: [loading], }).then((msg) => 
					{
						setTimeout(() => 
						{
							msg.delete();
						}, 5000);
					});
				}
				if (json.error) throw new Error(json.error);

				await user.updateOne({
					conversationWithMusashi: user.conversationWithMusashi + 1,
				});
				return message.reply({ content: json.generated_text, });
			})
			.catch((err) => 
			{
				if (err.message.includes("EHOSTUNREACH") && EHOSTRetries < 3) 
				{
					EHOSTRetries += 1;
					return respond();
				}

				console.error(err);
				return message
					.reply({
						embeds: [
							new EmbedBuilder()
								.setColor("Red")
								.setDescription(
									`Encountered error while connecting to the API. Please retry or contact support using \`/musashi support\`\n\n` +
										`[${err.name}] ${err.message}`
								)
						],
					})
					.then((msg) => 
					{
						setTimeout(() => 
						{
							msg.delete();
						}, 5000);
					});
			});
	};
	respond();

	Cooldown.set(message.guildId, Date.now() + 3000);
	setTimeout(() => 
	{
		Cooldown.delete(message.guildId);
	}, 4000);
});
