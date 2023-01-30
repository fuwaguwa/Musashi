import {
	ChatInputApplicationCommandData,
	ChatInputCommandInteraction,
	MessageApplicationCommandData,
	MessageContextMenuCommandInteraction,
	UserApplicationCommandData,
	UserContextMenuCommandInteraction
} from "discord.js";
import { Musashi } from "../structures/Client";

interface ChatInputCommandRunOptions {
	client: Musashi;
	interaction: ChatInputCommandInteraction;
}

interface MessageCommandRunOptions {
	client: Musashi;
	interaction: MessageContextMenuCommandInteraction;
}

interface UserCommandRunOptions {
	client: Musashi;
	interaction: UserContextMenuCommandInteraction;
}

type ChatInputCommandRunFunction = (options: ChatInputCommandRunOptions) => any;

type MessageCommandRunFunction = (options: MessageCommandRunOptions) => any;

type UserCommandRunFunction = (options: UserCommandRunOptions) => any;

export type ChatInputCommandType = {
	cooldown: number;
	nsfw?: boolean;
	ownerOnly?: boolean;
	run: ChatInputCommandRunFunction;
} & ChatInputApplicationCommandData;

export type MessageCommandType = {
	cooldown: number;
	run: MessageCommandRunFunction;
} & MessageApplicationCommandData;

export type UserCommandType = {
	cooldown: number;
	run: UserCommandRunFunction;
} & UserApplicationCommandData;
