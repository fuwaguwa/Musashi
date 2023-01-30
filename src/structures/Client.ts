import {
	ApplicationCommandDataResolvable,
	Client,
	ClientEvents,
	Collection,
	EmbedBuilder,
	TextChannel
} from "discord.js";
import {
	ChatInputCommandType
	// MessageCommandType,
	// UserCommandType
} from "../typings/Command";
import glob from "glob";
import { promisify } from "util";
import { RegisterCommandsOptions } from "../typings/CommandRegistration";
import { Event } from "./Event";
import mongoose from "mongoose";

const promiseGlob = promisify(glob);

export class Musashi extends Client 
{
	commands: Collection<string, ChatInputCommandType> = new Collection();
	// messageCommands: Collection<string, MessageCommandType> = new Collection();
	// userCommands: Collection<string, UserCommandType> = new Collection();

	constructor() 
	{
		super({ intents: 35345, });
	}

	start() 
	{
		this.registerModules();
		this.connectToDatabase();
		this.login(process.env.botToken);

		// Error Catchers
		process.on("unhandledRejection", async (err) => 
		{
			console.error("Unhandled Promise Rejection:\n", err);
		});

		process.on("uncaughtException", async (err) => 
		{
			console.error("Uncaught Promise Exception:\n", err);
		});

		process.on("uncaughtExceptionMonitor", async (err) => 
		{
			console.error("Uncaught Promise Exception (Monitor):\n", err);
		});

		process.on("multipleResolves", async (type, promise, reason) => 
		{
			if (!reason) return;
			if (
				reason.toLocaleString() ===
				"Error: Cannot perform IP discovery - socket closed"
			)
				return;
			if (reason.toLocaleString() === "AbortError: The operation was aborted")
				return;

			console.error("Multiple Resolves:\n", type, promise, reason);
		});

		(async () => 
		{
			// Heartbeat
			const guild = await this.guilds.fetch("1002188088942022807");
			const channel = await guild.channels.fetch("1069502795654381638");

			const startEmbed: EmbedBuilder = new EmbedBuilder()
				.setColor("Green")
				.setDescription("Musashi has been started!")
				.setTimestamp();
			await (channel as TextChannel).send({ embeds: [startEmbed], });

			let uptime = 300000;
			setInterval(async () => 
			{
				let totalSeconds = uptime / 1000;
				totalSeconds %= 86400;

				let hours = Math.floor(totalSeconds / 3600);
				totalSeconds %= 3600;

				let minutes = Math.floor(totalSeconds / 60);
				let seconds = Math.floor(totalSeconds % 60);

				const heartbeatEmbed: EmbedBuilder = new EmbedBuilder()
					.setColor("Grey")
					.setDescription(
						`Musashi has been running for \`${hours} hours, ${minutes} minutes, ${seconds} seconds\``
					)
					.setTimestamp();
				await (channel as TextChannel).send({ embeds: [heartbeatEmbed], });

				uptime += 300000;

				fetch(
					`https://api-inference.huggingface.co/models/Fuwaguwa/DialoGPT-Medium-AzurLaneMusashi-v${process.env.modelVersion}`,
					{
						method: "POST",
						headers: {
							Authorization: `Bearer ${process.env.huggingfaceApiKey}`,
						},
						body: JSON.stringify({ inputs: "initialize", }),
					}
				);
			}, 300000);
		})();
	}

	private connectToDatabase() 
	{
		mongoose
			.connect(process.env.mongoDB)
			.then(() => 
			{
				console.log("Connected to database!");
			})
			.catch((err) => 
			{
				console.log(err);
			});
	}

	private async importFile(filePath: string) 
	{
		return (await import(filePath))?.default;
	}

	private async registerCommands({
		commands,
		guildId,
	}: RegisterCommandsOptions) 
	{
		if (guildId) 
		{
			this.guilds.cache.get(guildId)?.commands.set(commands);
			console.log(`Registering Command | Guild: ${guildId}`);
		}
		else 
		{
			this.application?.commands.set(commands);
			console.log("Registering Commands | Global");
		}
	}

	private async registerModules() 
	{
		/**
		 * Registering Slash Commands
		 */
		const fCommands: ApplicationCommandDataResolvable[] = [];

		const commandFiles = await promiseGlob(
			`${__dirname}/../commands/*/*{.ts,.js}`
		);
		// const messageFiles = await promiseGlob(
		// 	`${__dirname}/../menu/message/*/*{.ts,.js}`
		// );
		// const userFiles = await promiseGlob(
		// 	`${__dirname}/../menu/user/*/*{.ts,.js}`
		// );

		commandFiles.forEach(async (filePath) => 
		{
			const command: ChatInputCommandType = await this.importFile(filePath);
			if (!command.name) return;

			this.commands.set(command.name, command);
			fCommands.push(command);
		});

		// messageFiles.forEach(async (filePath) =>
		// {
		// 	const command: MessageCommandType = await this.importFile(filePath);
		// 	if (!command.name) return;

		// 	this.messageCommands.set(command.name, command);
		// 	fCommands.push(command);
		// });

		// userFiles.forEach(async (filePath) =>
		// {
		// 	const command: UserCommandType = await this.importFile(filePath);
		// 	if (!command.name) return;

		// 	this.userCommands.set(command.name, command);
		// 	fCommands.push(command);
		// });

		this.on("ready", () => 
		{
			this.registerCommands({
				commands: fCommands,
				guildId: process.env.guildId,
			});
		});

		/**
		 * Registering Event
		 */
		const eventFiles = await promiseGlob(`${__dirname}/../events/*{.ts,.js}`);

		eventFiles.forEach(async (filePath) => 
		{
			const event: Event<keyof ClientEvents> = await this.importFile(filePath);
			this.on(event.event, event.run);
		});
	}
}
