import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChatInputCommandInteraction,
	EmbedBuilder
} from "discord.js";

export = async (interaction: ChatInputCommandInteraction) => 
{
	const musashiEmbed: EmbedBuilder = new EmbedBuilder()
		.setColor("#2f3136")
		.setTitle("Musashi")
		.setDescription(
			"Musashi Azur Lane Chatbot!\n\n" +
				"Trained with DialoGPT Model by Microsoft\n\n" +
				"Developer: [**Fuwafuwa**](https://github.com/fuwaguwa)\n" +
				"Art by [Dishwasher1910](https://www.pixiv.net/en/users/13408193)\n" +
				"Special Thanks: [**LaziestBoy**](https://github.com/kaisei-kto)\n"
		);

	const mainButtons: ActionRowBuilder<ButtonBuilder> =
		new ActionRowBuilder<ButtonBuilder>().setComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setEmoji({ name: "👋", })
				.setLabel("Invite Musashi!")
				.setURL(
					"https://discord.com/api/oauth2/authorize?client_id=1069511313832820746&permissions=137439340544&scope=bot%20applications.commands"
				),
			new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setEmoji({ name: "⚙️", })
				.setLabel("Support Server")
				.setURL("https://discord.gg/NFkMxFeEWr"),
			new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setEmoji({ id: "1065583023086641203", })
				.setLabel("Contribute")
				.setURL("https://github.com/fuwaguwa/Musashi")
		);
	await interaction.reply({
		embeds: [musashiEmbed],
		components: [mainButtons],
	});
};
