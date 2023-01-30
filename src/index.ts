import { config } from "dotenv";
import { Musashi } from "./structures/Client";
config();

export const client = new Musashi();

client.start();
