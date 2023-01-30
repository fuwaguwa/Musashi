import { ChatInputCommand } from "../../structures/Command";
import { ApplicationCommandOptionType } from "discord.js";
import musashiFunc from "./subcommands/musashiSubs";

export default new ChatInputCommand({
	name: "musashi",
	description: "Information about Musashi.",
	cooldown: 4500,
	options: [
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "info",
			description: "Show information about Musashi.",
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "stats",
			description: "Display Musashi's stats.",
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "ping",
			description: "Show Musashi's ping.",
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "support",
			description: "Run this command if you got any problem with Musashi!",
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "help",
			description: "How to use and setup the bot.",
		}
	],
	run: async ({ interaction, }) => 
	{
		switch (interaction.options.getSubcommand()) 
		{
			case "info": {
				return musashiFunc.info(interaction);
			}

			case "stats": {
				return musashiFunc.stats(interaction);
			}

			case "ping": {
				return musashiFunc.ping(interaction);
			}

			case "support": {
				return musashiFunc.support(interaction);
			}

			case "help": {
				return musashiFunc.help(interaction);
			}
		}
	},
});
