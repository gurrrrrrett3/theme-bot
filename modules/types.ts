import Discord from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export interface Command {
    data: SlashCommandBuilder;
    execute(interaction: Discord.CommandInteraction, ...args: any[]): Promise<void>;
}

export interface ButtonFile {
    data: {
        customId: string;
        execute: (interaction: Discord.ButtonInteraction, ...args: any[]) => Promise<void>;
    };
}

export interface SelectMenuFile {
    data: {
        customId: string;
        execute: (interaction: Discord.SelectMenuInteraction, ...args: any[]) => Promise<void>;
    };
}