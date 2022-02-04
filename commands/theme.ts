import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandStringOption, SlashCommandIntegerOption } from '@discordjs/builders';
import Discord from 'discord.js';
import DataManager from '../modules/dataManager';

const Command = {
    data: new SlashCommandBuilder()
        .setName('theme')
        .setDescription('Edit your Theme settings')
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName('set')
            .setDescription('Set your theme')
            .addStringOption(new SlashCommandStringOption()
            .setRequired(true)
            .setName('theme')
            .setDescription('A youtube video url')
            ))
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName('volume')
            .setDescription('Set your theme volume')
            .addIntegerOption(new SlashCommandIntegerOption()
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(100)
            .setName('volume')
            .setDescription('The volume of the theme, from 1 to 100')
            )) 
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName('remove')
            .setDescription('Remove your theme')
        )
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName('view')
            .setDescription('View your theme')
        )
        ,
        async execute(interaction: Discord.CommandInteraction, ...args: any[]) {
            if (!interaction.isCommand()) return
            const commandOptions = interaction.options
            const commandData = commandOptions.data
            const subCommand = commandData[0].name

            switch (subCommand) {
                case 'set':
                    const theme = commandOptions.getString('theme')
                    if (!theme) return
                    console.log(`Setting theme to ${theme}`)
                    interaction.reply(`Setting theme to ${theme}`)
                    DataManager.setUserTheme(interaction.user.id, theme)
                    break
                case 'volume':
                    const volume = commandOptions.getInteger('volume')
                    if (!volume) return
                    console.log(`Setting volume to ${volume}`)
                    interaction.reply(`Setting volume to ${volume}`)
                    DataManager.setUserVolume(interaction.user.id, volume)
                    break
                case 'remove':
                    console.log(`Removing theme`)
                    interaction.reply(`Removing theme`)
                    DataManager.setUserTheme(interaction.user.id, null)
                    break
                case 'view':
                    console.log(`Viewing theme`)
                    const userTheme = DataManager.getUserTheme(interaction.user.id)
                    interaction.reply(userTheme ? `Your theme is ${userTheme}` : `You don't have a theme set`)
                    break
                default:
                    interaction.reply(`Unknown subcommand ${subCommand}`)
                    break
            }
        }
}
module.exports = Command;