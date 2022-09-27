
/**
 * @name Theme-Bot
 * @extends Discord-Bot-Template garthttps://github.com/gurrrrrrett3/discord-bot-template
 * @author https://github.com/gurrrrrrett3 gart#9211
 * @see Amari
 * @license MIT
 */

import { Client } from 'discord.js';
import { PrismaClient } from "@prisma/client"
import Bot from './bot/bot';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
    intents: [
        "Guilds",
        "GuildMessages",
        "GuildVoiceStates"
    ]
})

// hide dumb memory leak warning
client.setMaxListeners(0)

export const bot = new Bot(client);
export const db = new PrismaClient();

client.login(process.env.TOKEN);