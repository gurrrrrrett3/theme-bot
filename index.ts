import { Client, IntentsBitField } from "discord.js";
import { PrismaClient } from "@prisma/client";
import Bot from "./modules/bot";
import env from "dotenv";

env.config()

const client = new Client(
    {
        intents: [IntentsBitField.Flags.GuildVoiceStates, IntentsBitField.Flags.Guilds]
    }
);

client.login(process.env.BOT_TOKEN);

export const bot = new Bot(client);
export const db = new PrismaClient();